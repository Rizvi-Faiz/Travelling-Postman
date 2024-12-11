import db from "@/lib/db";

export default async function POST(req, res) {
  if (req.method === 'POST') {
    const { sourceCity, destinationCity } = req.body;

    if (!sourceCity || !destinationCity) {
      return res.status(400).json({ error: "Source and Destination cities are required." });
    }

    try {
      // Query the database for orders matching the source and destination cities
      const query = `
        SELECT 
          Order_ID,
          Weight,
          Volume,
          Preference,
          Cost
        FROM Orders
        WHERE Current_Sender_Location = $1 AND Current_Receiver_Location = $2;
      `;

      const values = [sourceCity, destinationCity];
      
      const result = await db.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'No orders found for the specified route.' });
      }

      // Return the filtered orders
      return res.status(200).json({ orders: result.rows });

    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ error: "Failed to fetch orders." });
    }

  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
