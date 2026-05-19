const { pool, testConnection } = require("./db");

const createTables = async () => {
	await testConnection();

	const queries = [
		`CREATE TABLE IF NOT EXISTS users (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(100)  NOT NULL,
      email       VARCHAR(191)  NOT NULL UNIQUE,
      password    VARCHAR(255)  NOT NULL,
      created_at  DATETIME      DEFAULT NOW()
    )`,

		`CREATE TABLE IF NOT EXISTS refresh_tokens (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      user_id     INT           NOT NULL,
      token       VARCHAR(512)  NOT NULL UNIQUE,
      expires_at  DATETIME      NOT NULL,
      created_at  DATETIME      DEFAULT NOW(),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,

		`CREATE TABLE IF NOT EXISTS contacts (
      id                INT AUTO_INCREMENT PRIMARY KEY,
      user_id           INT           NOT NULL,
      name              VARCHAR(100)  NOT NULL,
      surname           VARCHAR(100)  NOT NULL,
      email             VARCHAR(191)  NOT NULL,
      telegram_handle   VARCHAR(100)  DEFAULT NULL,
      telegram_chat_id  BIGINT        DEFAULT NULL,
      invite_token      VARCHAR(64)   UNIQUE,
      invite_status     ENUM('pending','accepted') DEFAULT 'pending',
      created_at        DATETIME      DEFAULT NOW(),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,

		`CREATE TABLE IF NOT EXISTS reports (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      user_id     INT           NOT NULL,
      title       VARCHAR(255)  NOT NULL,
      description TEXT          NOT NULL,
      lat         DECIMAL(9,6)  NOT NULL,
      lng         DECIMAL(9,6)  NOT NULL,
      address     VARCHAR(255)  DEFAULT NULL,
      created_at  DATETIME      DEFAULT NOW(),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,

		`CREATE TABLE IF NOT EXISTS sos_events (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      user_id     INT           NOT NULL,
      session_id  VARCHAR(64)   NOT NULL UNIQUE,
      lat         DECIMAL(9,6)  DEFAULT NULL,
      lng         DECIMAL(9,6)  DEFAULT NULL,
      status      ENUM('active','resolved') DEFAULT 'active',
      created_at  DATETIME      DEFAULT NOW(),
      resolved_at DATETIME      DEFAULT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
	];

	for (const query of queries) {
		await pool.query(query);
	}

	console.log("All tables created successfully");
	process.exit(0);
};

createTables().catch((err) => {
	console.error("Migration failed:", err);
	process.exit(1);
});
