import db from '../../../lib/db';

export async function GET(req) {
    try {
        const query = 'SELECT id, name, username, email FROM users WHERE username = $1';
        const values = ['exampleUser']; 
        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
            });
        }

        const user = result.rows[0];
        return new Response(JSON.stringify(user), {
            status: 200,
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            {
                status: 500,
            }
        );
    }
}
