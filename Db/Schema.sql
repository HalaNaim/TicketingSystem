-- Roles
CREATE TABLE Roles (
  Id INT PRIMARY KEY IDENTITY(1,1),
  RoleName VARCHAR(50) UNIQUE
);

-- Users
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Password NVARCHAR(100) NOT NULL,
    RoleId INT NOT NULL,
    PasswordResetToken NVARCHAR(200) NULL,
    PasswordResetExpiry DATETIME NULL,
    FOREIGN KEY (RoleId) REFERENCES Roles(Id)
);

-- Categories
CREATE TABLE Categories (
  Id INT PRIMARY KEY IDENTITY(1,1),
  CategoryName VARCHAR(100)
);

-- Priorities
CREATE TABLE Priorities (
  Id INT PRIMARY KEY IDENTITY(1,1),
  PriorityName VARCHAR(50) UNIQUE
);

-- Statuses
CREATE TABLE Statuses (
  Id INT PRIMARY KEY IDENTITY(1,1),
  StatusName VARCHAR(50) UNIQUE
);

-- Tickets
CREATE TABLE Tickets (
  Id INT PRIMARY KEY IDENTITY(1,1),
  Subject VARCHAR(150),
  Description TEXT,
  CreatedDate DATETIME DEFAULT GETDATE(),
  UpdatedDate DATETIME,
  UserId INT,
  AgentId INT,
  CategoryId INT,
  PriorityId INT,
  StatusId INT,
  FOREIGN KEY (UserId) REFERENCES Users(Id),
  FOREIGN KEY (AgentId) REFERENCES Users(Id),
  FOREIGN KEY (CategoryId) REFERENCES Categories(Id),
  FOREIGN KEY (PriorityId) REFERENCES Priorities(Id),
  FOREIGN KEY (StatusId) REFERENCES Statuses(Id)
);

-- TicketComments
CREATE TABLE TicketComments (
  Id INT PRIMARY KEY IDENTITY(1,1),
  TicketId INT,
  UserId INT,
  Content TEXT,
  Timestamp DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (TicketId) REFERENCES Tickets(Id),
  FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- TicketAttachments
CREATE TABLE TicketAttachments (
  Id INT PRIMARY KEY IDENTITY(1,1),
  TicketId INT,
  FilePath VARCHAR(255),
  UploadedDate DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (TicketId) REFERENCES Tickets(Id)
);

-- Notifications
CREATE TABLE Notifications (
  Id INT PRIMARY KEY IDENTITY(1,1),
  UserId INT,
  Message VARCHAR(255),
  CreatedDate DATETIME DEFAULT GETDATE(),
  IsRead BIT DEFAULT 0,
  FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- ActivityLogs
CREATE TABLE ActivityLogs (
  Id INT PRIMARY KEY IDENTITY(1,1),
  UserId INT,
  Action VARCHAR(255),
  Timestamp DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (UserId) REFERENCES Users(Id)
);
