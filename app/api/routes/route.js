import db from "@/lib/db";
import Papa from "papaparse";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { senderCity, receiverCity, preference, weight, orderId } = await req.json();

    console.log("Debug: Request JSON:", { senderCity, receiverCity, preference, weight, orderId });
    console.log("Type of weight:", typeof weight);

    if (!senderCity || !receiverCity || !preference || !weight || !orderId) {
      console.error("Debug: Missing Required Fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const csvFilePath = path.join(process.cwd(), "public/data/multi_modal_top_5_routes_cost.csv");
    // console.log("Debug: CSV File Path:", csvFilePath);

    if (!fs.existsSync(csvFilePath)) {
      console.error("Debug: CSV File Missing");
      return new Response(JSON.stringify({ error: "CSV file not found" }), { status: 500 });
    }

    const csvData = fs.readFileSync(csvFilePath, "utf8");
    // console.log("Debug: Raw CSV Data:", csvData);

    const { data: routes } = Papa.parse(csvData, { header: true });
    // console.log("Debug: Parsed Routes:", routes);

    const routeData = routes.find(
        (route) => {
            const startCity = route.startcity ? route.startcity.trim().toLowerCase() : '';
            const endCity = route.endcity ? route.endcity.trim().toLowerCase() : '';
            console.log("Debug: Checking cities:", senderCity.trim().toLowerCase(), receiverCity.trim().toLowerCase(), startCity, endCity);
            return startCity === senderCity.trim().toLowerCase() && endCity === receiverCity.trim().toLowerCase();
            
        }
      );
      
    // console.log("Debug: Matched Route Data:", routeData);

    if (!routeData) {
      return new Response(
        JSON.stringify({ error: "No routes found for the given cities" }),
        { status: 404 }
      );
    }

    const paths = [];
    for (let i = 1; i <= 5; i++) {
      const path = routeData[`Route ${i}`];
      const cost = parseFloat(routeData[`Cost ${i}`]);
      const time = parseFloat(routeData[`Time ${i}`]);
      if (path && !isNaN(cost) && !isNaN(time)) {
        paths.push({ path, cost, time });
      }
    }
    // console.log("Debug: Extracted Paths and Costs:", paths);

    if (paths.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid paths found" }),
        { status: 500 }
      );
    }

    const isRouteSafe = (path) => {
        const nodes = path.split(/\s?\(road\)|\s?\(rail\)|\s?\(air\)/).map((node) => node.trim()).filter((node) => node !== '');     
        // console.log("Debug: Safety Check for Nodes:", nodes);
        return nodes.every((node) => true);
      };
      
      const safePaths = paths.filter((route) => isRouteSafe(route.path));
      // console.log("Debug: Safe Paths:", safePaths);
      

    if (safePaths.length === 0) {
      return new Response(
        JSON.stringify({ error: "No safe routes found" }),
        { status: 500 }
      );
    }

    const selectedRoute =
      preference === "Cost"
        ? safePaths.reduce((a, b) => (a.cost < b.cost ? a : b))
        : safePaths[0];
    console.log("Debug: Selected Route:", selectedRoute);

    const routeCheckQuery = `
      SELECT * FROM routes WHERE source = $1 AND destination = $2 AND path = $3
      ORDER BY current_capacity ASC
    `;
    const routeCheckResult = await db.query(routeCheckQuery, [
      senderCity,
      receiverCity,
      selectedRoute.path,
    ]);

    if (routeCheckResult.rows.length > 0) {
      const existingRoute = routeCheckResult.rows[0];
      console.log("Debug: Existing Route Found:", existingRoute);

      const newCapacity = Number(existingRoute.current_capacity) + Number(weight);
      console.log("Debug: New Capacity:", newCapacity);

      if (newCapacity > existingRoute.total_capacity) {
        const dispatcherQuery = `
          SELECT * FROM dispatcher
          WHERE current_location = $1
          AND dispatcher_id NOT IN (
            SELECT dispatcher_id FROM routes
            WHERE source = $1
          )
        `;
        const dispatcherResult = await db.query(dispatcherQuery, [senderCity]);

        if (dispatcherResult.rows.length === 0) {
          console.error("Debug: No Available Dispatcher");
          return new Response(
            JSON.stringify({ error: "No available dispatcher near source location who is not already assigned" }),
            { status: 404 }
          );
        }

        const newDispatcherId = dispatcherResult.rows[0].dispatcher_id;
        console.log("Debug: New Dispatcher ID:", newDispatcherId);

        const newRouteQuery = `
          INSERT INTO routes (source, destination, preference, path, cost, dispatcher_id, current_capacity, total_capacity)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
        const newRouteValues = [
          senderCity,
          receiverCity,
          preference,
          selectedRoute.path,
          selectedRoute.cost,
          newDispatcherId,
          weight,
          1000,
        ];
        await db.query(newRouteQuery, newRouteValues);
        console.log("Debug: New Route Created");

        const routeId = (
          await db.query('SELECT route_id FROM routes WHERE path = $1', [selectedRoute.path])
        ).rows[0].id;

        const assignmentQuery = `
          INSERT INTO assignment (
            order_id, dispatcher_id, current_address, pickup_time, drop_address, drop_time, delay, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
        const assignmentValues = [
          orderId,
          newDispatcherId,
          senderCity,
          null,
          receiverCity,
          null,
          null,
          null,
        ];
        await db.query(assignmentQuery, assignmentValues);
        console.log("Debug: Assignment Created for New Route");

        return new Response(
          JSON.stringify({
            message: "Route capacity exceeded. Assigned new dispatcher and created new route.",
            dispatcherId: newDispatcherId,
          }),
          { status: 201 }
        );
      } else {
        try {
          // Select the earliest created route satisfying the condition
          const selectRouteQuery = `
            SELECT *
            FROM routes
            WHERE source = $1 AND destination = $2 AND path = $3
            ORDER BY current_capacity ASC
            LIMIT 1
          `;
          
          const routeResult = await db.query(selectRouteQuery, [
            senderCity,
            receiverCity,
            selectedRoute.path,
          ]);
      
          if (routeResult.rows.length === 0) {
            console.error("No matching route found");
            return new Response(
              JSON.stringify({ error: "No matching route found" }),
              { status: 404 }
            );
          }
      
          const routeToUpdate = routeResult.rows[0];
      
          console.log("Selected Route to Update:", routeToUpdate);
      
          // Validate values before updating
          console.log(
            "Update Parameters:", {
              newCapacity,
              // routeToUpdate.route_id
            }
          );
      
          // Update only the selected route
          const updateRouteQuery = `
            UPDATE routes
            SET current_capacity = $1
            WHERE route_id=$2
          `;
          
          const updateResult = await db.query(updateRouteQuery, [
            newCapacity,
            routeToUpdate.route_id
          ]);
      
          console.log("Update Result:", updateResult);
      
          if (updateResult.rowCount === 0) {
            console.error("Failed to update route capacity");
            return new Response(
              JSON.stringify({ error: "Failed to update route capacity" }),
              { status: 500 }
            );
          }
      
          console.log("Debug: Updated Existing Route Capacity");
      
          // Create an assignment for the updated route
          const assignmentQuery = `
            INSERT INTO assignment (
              order_id, dispatcher_id, current_address, pickup_time, drop_address, drop_time, delay, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `;
          const assignmentValues = [
            orderId,
            routeToUpdate.dispatcher_id,
            senderCity,
            null, // Pickup time (can be replaced with actual time)
            receiverCity,
            null, // Drop time (can be replaced with actual time)
            null, // Delay
            null, // Status
          ];
          
          await db.query(assignmentQuery, assignmentValues);
          console.log("Debug: Assignment Created for Updated Route");
      
          return new Response(
            JSON.stringify({
              message: "Route capacity updated successfully",
              route: routeToUpdate.path,
              cost: routeToUpdate.cost,
              dispatcherId: routeToUpdate.dispatcher_id,
            }),
            { status: 200 }
          );
        } catch (error) {
          console.error("Error in route update or assignment creation:", error);
          return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
          );
        }
      }
      
      
      
      
    } else {
      const dispatcherQuery = `
        SELECT dispatcher_id FROM dispatcher
        WHERE current_location = $1
        AND dispatcher_id NOT IN (
          SELECT dispatcher_id FROM routes
          WHERE source = $1 
        )
      `;
      const dispatcherResult = await db.query(dispatcherQuery, [senderCity]);

      if (dispatcherResult.rows.length === 0) {
        console.error("Debug: No Dispatcher Found");
        return new Response(
          JSON.stringify({ error: "No dispatcher found for the source location" }),
          { status: 404 }
        );
      }

      const dispatcherId = dispatcherResult.rows[0].dispatcher_id;
      console.log("Debug: Dispatcher ID Found:", dispatcherId);

      const routeQuery = `
        INSERT INTO routes (source, destination, preference, path, cost, dispatcher_id, current_capacity, total_capacity)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;
      const routeValues = [
        senderCity,
        receiverCity,
        preference,
        selectedRoute.path,
        selectedRoute.cost,
        dispatcherId,
        weight,
        1000,
      ];
      await db.query(routeQuery, routeValues);

      const routeId = (
        await db.query('SELECT route_id FROM routes WHERE path = $1', [selectedRoute.path])
      ).rows[0].id;

      const assignmentQuery = `
        INSERT INTO assignment (
          order_id, dispatcher_id, current_address, pickup_time, drop_address, drop_time, delay, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;
      const assignmentValues = [
        orderId,
        dispatcherId,
        senderCity,
        null,
        receiverCity,
        null,
        null,
        null,
      ];
      await db.query(assignmentQuery, assignmentValues);
      console.log("Debug: Assignment Created");

      return new Response(
        JSON.stringify({
          message: "Route created successfully",
          dispatcherId: dispatcherId,
        }),
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
