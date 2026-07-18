/*==========================================================
    Blood Donation Management System
    Database Script - Part 1
==========================================================*/

-- Create Database
IF DB_ID('BloodDonationDB') IS NULL
BEGIN
CREATE DATABASE BloodDonationDB;
END
GO

USE BloodDonationDB;
GO

/*==========================================================
    Drop Tables (If Exists)
==========================================================*/

IF OBJECT_ID('Notifications', 'U') IS NOT NULL DROP TABLE Notifications;
IF OBJECT_ID('DonationHistory', 'U') IS NOT NULL DROP TABLE DonationHistory;
IF OBJECT_ID('BloodRequests', 'U') IS NOT NULL DROP TABLE BloodRequests;
IF OBJECT_ID('BloodInventory', 'U') IS NOT NULL DROP TABLE BloodInventory;
IF OBJECT_ID('Donors', 'U') IS NOT NULL DROP TABLE Donors;
IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;
IF OBJECT_ID('Roles', 'U') IS NOT NULL DROP TABLE Roles;
GO

/*==========================================================
    Roles Table
==========================================================*/

CREATE TABLE Roles
(
    RoleId INT IDENTITY(1,1) PRIMARY KEY,

    RoleName NVARCHAR(50) NOT NULL UNIQUE,

    Description NVARCHAR(200),

    CreatedDate DATETIME DEFAULT GETDATE()
);

GO

/*==========================================================
    Users Table
==========================================================*/

CREATE TABLE Users
(
    UserId INT IDENTITY(1,1) PRIMARY KEY,

    FullName NVARCHAR(100) NOT NULL,

    Email NVARCHAR(100) NOT NULL UNIQUE,

    PasswordHash NVARCHAR(255) NOT NULL,

    PhoneNumber NVARCHAR(15),

    RoleId INT NOT NULL,

    IsActive BIT DEFAULT 1,

    CreatedDate DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Users_Roles
        FOREIGN KEY(RoleId)
        REFERENCES Roles(RoleId)
);

GO

/*==========================================================
    Donors Table
==========================================================*/

CREATE TABLE Donors
(
    DonorId INT IDENTITY(1,1) PRIMARY KEY,

    UserId INT NOT NULL,

    BloodGroup NVARCHAR(5) NOT NULL,

    Gender NVARCHAR(10) NOT NULL,

    DateOfBirth DATE NOT NULL,

    Weight DECIMAL(5,2),

    Address NVARCHAR(250),

    LastDonationDate DATE NULL,

    IsEligible BIT DEFAULT 1,

    CONSTRAINT FK_Donors_Users
        FOREIGN KEY(UserId)
        REFERENCES Users(UserId)
);

GO

/*==========================================================
    BloodInventory Table
==========================================================*/

CREATE TABLE BloodInventory
(
    InventoryId INT IDENTITY(1,1) PRIMARY KEY,

    BloodGroup NVARCHAR(5) NOT NULL,

    UnitsAvailable INT NOT NULL DEFAULT 0,

    LastUpdated DATETIME DEFAULT GETDATE()
);

GO

/*==========================================================
    BloodRequests Table
==========================================================*/

CREATE TABLE BloodRequests
(
    RequestId INT IDENTITY(1,1) PRIMARY KEY,

    PatientName NVARCHAR(100) NOT NULL,

    BloodGroup NVARCHAR(5) NOT NULL,

    UnitsRequired INT NOT NULL,

    HospitalName NVARCHAR(150) NOT NULL,

    ContactNumber NVARCHAR(15),

    Status NVARCHAR(20) DEFAULT 'Pending',

    RequestedDate DATETIME DEFAULT GETDATE()
);

GO

/*==========================================================
    DonationHistory Table
==========================================================*/

CREATE TABLE DonationHistory
(
    DonationId INT IDENTITY(1,1) PRIMARY KEY,

    DonorId INT NOT NULL,

    DonationDate DATE NOT NULL,

    UnitsDonated INT NOT NULL,

    Remarks NVARCHAR(250),

    CONSTRAINT FK_DonationHistory_Donors
        FOREIGN KEY(DonorId)
        REFERENCES Donors(DonorId)
);

GO

/*==========================================================
    Notifications Table
==========================================================*/

CREATE TABLE Notifications
(
    NotificationId INT IDENTITY(1,1) PRIMARY KEY,

    UserId INT NOT NULL,

    Title NVARCHAR(100) NOT NULL,

    Message NVARCHAR(300) NOT NULL,

    IsRead BIT DEFAULT 0,

    CreatedDate DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Notifications_Users
        FOREIGN KEY(UserId)
        REFERENCES Users(UserId)
);

GO

/*==========================================================
    Insert Default Roles
==========================================================*/

INSERT INTO Roles (RoleName, Description)
VALUES
('Admin', 'System Administrator'),
('Donor', 'Blood Donor');

GO

/*==========================================================
    Insert Blood Inventory
==========================================================*/

INSERT INTO BloodInventory (BloodGroup, UnitsAvailable)
VALUES
('A+', 10),
('A-', 5),
('B+', 8),
('B-', 4),
('AB+', 3),
('AB-', 2),
('O+', 15),
('O-', 6);

GO

/*==========================================================
    Verify Data
==========================================================*/

SELECT * FROM Roles;
SELECT * FROM Users;
SELECT * FROM Donors;
SELECT * FROM BloodInventory;
SELECT * FROM BloodRequests;
SELECT * FROM DonationHistory;
SELECT * FROM Notifications;

GO

INSERT INTO Users
(
    FullName,
    Email,
    PasswordHash,
    PhoneNumber,
    RoleId,
    IsActive,
    CreatedDate
)
VALUES
(
    'Aniket Singh',
    'aniket@gmail.com',
    '123456',
    '9876543210',
    1,
    1,
    GETDATE()
);


SELECT * FROM Users;


INSERT INTO Donors
(
    UserId,
    BloodGroup,
    Gender,
    DateOfBirth,
    Weight,
    Address,
    LastDonationDate,
    IsEligible
)
VALUES
(
    1,
    'B+',
    'Male',
    '2005-02-15',
    70,
    'Delhi',
    '2026-01-10',
    1
);

SELECT * FROM Donors;

INSERT INTO BloodRequests
(
    PatientName,
    BloodGroup,
    UnitsRequired,
    HospitalName,
    ContactNumber,
    Status,
    RequestedDate
)
VALUES
(
    'Rahul Kumar',
    'B+',
    2,
    'AIIMS Delhi',
    '9876543210',
    'Pending',
    GETDATE()
);

INSERT INTO DonationHistory
(
    DonorId,
    DonationDate,
    UnitsDonated,
    Remarks
)
VALUES
(
    1,
    GETDATE(),
    1,
    'First Donation'
);

INSERT INTO Notifications
(
    UserId,
    Title,
    Message,
    IsRead,
    CreatedDate
)
VALUES
(
    1,
    'Welcome',
    'Welcome to Blood Donation Management System',
    0,
    GETDATE()
);

go
select * from Roles
select * from users
delete users where UserId=2
delete Roles where RoleId=4

USE BloodDonationDB;
GO

SELECT * FROM Roles;

SELECT * FROM Roles WHERE RoleId = 2;
