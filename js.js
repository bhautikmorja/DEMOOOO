// Cron job function
function distributeAmount() {
    // Get the current time
    const currentTime = new Date();

    // Query to select all users and their corresponding packages
    const query = `
        SELECT Users.id, Users.balance, Users.last_updated, Packages.duration, Packages.amount
        FROM Users
        INNER JOIN Packages ON Users.package_id = Packages.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.log('Error fetching users:', err);
            return;
        }

        results.forEach(user => {
            const { id, balance, last_updated, duration, amount } = user;

            // Calculate time difference between now and the last update time
            const lastUpdateTime = new Date(last_updated);
            const timeDiff = Math.floor((currentTime - lastUpdateTime) / 60000); // convert to minutes

            // If the time difference is greater than or equal to the package duration, update the user's balance
            if (timeDiff >= duration) {
                const newBalance = balance + amount; // Add package amount to user's balance

                // Update the user's balance and reset the last_updated timestamp
                const updateQuery = `
                    UPDATE Users 
                    SET balance = ?, last_updated = ? 
                    WHERE id = ?
                `;
                db.query(updateQuery, [newBalance, currentTime, id], (updateErr) => {
                    if (updateErr) {
                        console.log(`Error updating user ${id}'s balance:`, updateErr);
                    } else {
                        console.log(`User ${id}'s balance updated successfully to $${newBalance}`);
                    }
                });
            }
        });
    });
}

// Run the function every minute
setInterval(distributeAmount, 60 * 1000);
