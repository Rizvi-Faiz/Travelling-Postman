import db from "@/lib/db";

export async function POST(req) {
  try {
    // Step 1: Parse Input
    const { dispatcherId, currentAddress, selectedRoute } = await req.json();

    console.log("Debug: Received Input", { dispatcherId, currentAddress, selectedRoute });

    if (!dispatcherId || !currentAddress || !selectedRoute) {
      console.error("Debug: Missing Required Fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Step 2: Update the Database
    const queryText = `
      UPDATE routes
      SET path = $1, source = $2
      WHERE dispatcher_id = $3
    `;
    console.log("Debug: Executing Query:", queryText, [selectedRoute, currentAddress, dispatcherId]);

    const result = await db.query(queryText, [selectedRoute, currentAddress, dispatcherId]);

    if (result.rowCount > 0) {
      console.log("Debug: Route Updated Successfully");
      return new Response(
        JSON.stringify({ success: true, message: "Route updated successfully." }),
        { status: 200 }
      );
    } else {
      console.error("Debug: No Route Found for the Given Dispatcher ID");
      return new Response(
        JSON.stringify({ error: "No route found for the given dispatcher ID." }),
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error Stack Trace:", error.stack);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
