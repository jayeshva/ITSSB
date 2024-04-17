// Import the mysql2 module
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost', 
    user: 'root',
    password: '', 
    database: 'museli_shop',
});

// Connect to the database
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }

    console.log('Connected to database');

    // Create user table if not exists
    connection.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL,
    INDEX fk_email_idx (email) -- Index for email column
  )
`, (error, results) => {
        if (error) {
            console.error('Error creating user table:', error);
        } else {
            console.log('User table created or already exists');
        }
        // Release the connection
        connection.release();
    });

    // Create museli_component table if not exists
    connection.query(`
  CREATE TABLE IF NOT EXISTS museli_component (
    component_id INT AUTO_INCREMENT PRIMARY KEY,
    component_name VARCHAR(255) NOT NULL,
    component_category VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    weight_in_gram DECIMAL(10,2) NOT NULL,
    carbohydrates_per_gram DECIMAL(10,2) NOT NULL,
    proteins_per_gram DECIMAL(10,2) NOT NULL,
    fats_per_gram DECIMAL(10,2) NOT NULL,
    created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX fk_component_name_idx (component_name) -- Index for component_name column
  )
`, (error, results) => {
        if (error) {
            console.error('Error creating museli_component table:', error);
        } else {
            console.log('Museli component table created or already exists');
        }
        // Release the connection
        connection.release();
    });

    // Create museli_mix table if not exists
    connection.query(`
  CREATE TABLE IF NOT EXISTS museli_mix (
    museli_id INT PRIMARY KEY,
    user_id INT,
    user_email VARCHAR(255),
    user_name VARCHAR(255), 
    museli_mix_name VARCHAR(255),
    base_component_id INT,
    base_component_name VARCHAR(255),
    total_price DECIMAL(10,2),
    total_protein DECIMAL(10,2),
    total_fats DECIMAL(10,2),
    total_carbohydrates DECIMAL(10,2),
    created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX fk_user_id_idx (user_id), -- Index for user_id column
    INDEX fk_user_email_idx (user_email), -- Index for user_email column
    INDEX fk_base_component_id_idx (Base_component_id), -- Index for Base_component_id column
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (user_email) REFERENCES users(email),
    FOREIGN KEY (Base_component_id) REFERENCES museli_component(component_id)
  )
`, (error, results) => {
        if (error) {
            console.error('Error creating museli_mix table:', error);
        } else {
            console.log('Museli mix table created or already exists');
        }
        connection.release();
    });

    // Create museli_mix_component table if not exists
    connection.query(`
    CREATE TABLE IF NOT EXISTS museli_mix_selected_component (
    id INT AUTO_INCREMENT PRIMARY KEY,
    museli_id INT,
    component_id INT,
    component_name VARCHAR(255),
    price DECIMAL(10,2),
    weight_in_gram DECIMAL(10,2), 
    carbohydrates_per_gram DECIMAL(10,2),
    proteins_per_gram DECIMAL(10,2),
    fats_per_gram DECIMAL(10,2),
    INDEX fk_Museli_id_idx (Museli_id), -- Index for Museli_id column
    INDEX fk_component_id_idx (component_id), -- Index for component_id column
    FOREIGN KEY (Museli_id) REFERENCES museli_mix(Museli_id),
    FOREIGN KEY (component_id) REFERENCES museli_component(component_id),
    FOREIGN KEY (component_name) REFERENCES museli_component(component_name)
    )
`, (error, results) => {
        if (error) {
            console.error('Error creating museli_mix_component table:', error);
        } else {
            console.log('Museli mix component table created or already exists');
        }
        connection.release();
    }
    ); 

    //Create a table for orders
    connection.query(`
    CREATE TABLE IF NOT EXISTS orders (
    order_id INT PRIMARY KEY,
    user_id INT,
    user_email VARCHAR(255),
    user_name VARCHAR(255),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_price DECIMAL(10,2),
    order_status VARCHAR(255) DEFAULT 'Pending',
    INDEX fk_user_id_idx (user_id), -- Index for user_id column
    INDEX fk_user_email_idx (user_email), -- Index for user_email column
    INDEX fk_order_id_idx (order_id), -- Index for order_id column
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (user_email) REFERENCES users(email)
    )
`, (error, results) => {
        if (error) {
            console.error('Error creating orders table:', error);
        } else {
            console.log('Orders table created or already exists');
        }
        connection.release();
    }
    );

    //Create a table for order details
    connection.query(`
    CREATE TABLE IF NOT EXISTS order_details (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    museli_id INT,
    museli_mix_name VARCHAR(255),
    price DECIMAL(10,2),
    quantity INT,
    INDEX fk_order_id_idx (order_id), -- Index for order_id column
    INDEX fk_museli_id_idx (museli_id), -- Index for museli_id column
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (museli_id) REFERENCES museli_mix(museli_id)
    )`, (error, results) => {
        if (error) {
            console.error('Error creating order_details table:', error);
        } else {
            console.log('Order details table created or already exists');
        }
        connection.release();
    }
    );

});



// Export a function to execute SQL queries
exports.query = async function (sql, params) {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);                
            }
        });
    });
};
