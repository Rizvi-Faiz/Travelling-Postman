import db from '@/lib/db'; // Replace with your actual DB connection logic

// Named export for the GET HTTP method
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const dispatcher_id = searchParams.get('dispatcherId');

  // Check if the dispatcherId is missing
  if (!dispatcher_id) {
    console.error('Dispatcher ID is missing in the request');
    return new Response(JSON.stringify({ error: 'Dispatcher ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Step 1: Fetch source and destination from the routes table
    const routeQuery = `
      SELECT source, destination
      FROM routes
      WHERE dispatcher_id = $1
    `;
    console.log('Executing query:', routeQuery, 'with params:', [dispatcher_id]);

    const routeResult = await db.query(routeQuery, [dispatcher_id]);
    const routeData = routeResult.rows[0]; // Assuming one route per dispatcher
    const { source, destination } = routeData || {};

    // Check if no route data is found
    if (!routeData) {
      console.warn('No route data found for dispatcher_id:', dispatcher_id);
      return new Response(JSON.stringify({ error: 'No route found for this dispatcher' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`Fetched route: source=${source}, destination=${destination}`);

    // Step 2: Query the assignment table for orders related to the dispatcher
    const assignmentQuery = `
      SELECT order_id, drop_time, status, current_address
      FROM assignment
      WHERE dispatcher_id = $1
    `;
    console.log('Executing query:', assignmentQuery, 'with params:', [dispatcher_id]);

    const assignmentResult = await db.query(assignmentQuery, [dispatcher_id]);

    // Check if no orders are found for the dispatcher
    if (!assignmentResult.rows || assignmentResult.rows.length === 0) {
      console.warn('No orders found for dispatcher_id:', dispatcher_id);
      return new Response(JSON.stringify({ error: 'No orders found for this dispatcher' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Step 3: Process the orders, calculate delays and check if current address matches destination
    const updatedOrders = await Promise.all(
      assignmentResult.rows.map(async (order) => {
        const { order_id, drop_time, status, current_address } = order;

        // Debugging: Log the order details
        console.log(`Processing order: ${order_id} with current_address: ${current_address}`);

        // Handle invalid drop_time
        if (!drop_time) {
          console.warn(`Invalid drop time for order ${order_id}`);
          return {
            orderId: order_id,
            status: "Unknown",
            delay: 0,
            source,
            destination,
            currentAddress: current_address,
            canDelete: false
          };
        }

        const expectedDropTime = new Date(drop_time);
        const currentTime = new Date();

        // Check for valid date
        if (isNaN(expectedDropTime)) {
          console.warn(`Invalid expected drop time for order ${order_id}`);
          return {
            orderId: order_id,
            status: "Invalid Drop Time",
            delay: 0,
            source,
            destination,
            currentAddress: current_address,
            canDelete: false
          };
        }

        // Calculate delay (in days)
        let delay = Math.max((currentTime - expectedDropTime) / (1000 * 60 * 60 * 24), 0); // Delay in days
        delay = Math.round(delay); // Round to nearest whole day

        // Debugging: Log the delay and status
        console.log(`Order ${order_id} has a delay of ${delay} days, current status: ${status}`);

        // Update status based on delay
        const updatedStatus = delay > 0 ? "Delayed" : status;

        // Step 4: Check if current address matches destination
        const canDelete = current_address === destination;

        // Step 5: Update delay and status in the database
        const updateQuery = `
          UPDATE assignment 
          SET delay = $1, status = $2
          WHERE order_id = $3
        `;
        console.log('Updating assignment table with delay and status for order_id:', order_id);

        await db.query(updateQuery, [delay, updatedStatus, order_id]);

        return {
          orderId: order_id,
          status: updatedStatus,
          delay,
          source,
          destination,
          currentAddress: current_address,
          canDelete
        };
      })
    );

    // Step 6: Return the updated orders with the canDelete flag
    console.log('Returning updated orders:', updatedOrders);
    return new Response(
      JSON.stringify(updatedOrders),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error occurred while processing the request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
