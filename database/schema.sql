-- ===== Schema =====
CREATE DATABASE IF NOT EXISTS tennis_ems
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;
USE tennis_ems;

-- ===== Safe drops (reverse dep order) =====
SET FOREIGN_KEY_CHECKS = 0;

-- =========================
-- USER MODULE (Sample v1)
-- Users as base account table
-- Admin/Coach/Student have their own PKs
-- =========================

DROP TABLE IF EXISTS `Student`;
DROP TABLE IF EXISTS `Coach`;
DROP TABLE IF EXISTS `Admin`;
DROP TABLE IF EXISTS `Users`;

-- 1) Base account table
CREATE TABLE `Users` (
  `userId` INT PRIMARY KEY AUTO_INCREMENT,

  `email` VARCHAR(255) NOT NULL,
  `passwordHash` VARCHAR(255) NOT NULL,

  `role` ENUM('ADMIN', 'COACH', 'STUDENT') NOT NULL,

  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,

  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY `uq_users_email` (`email`),
  INDEX `idx_users_active` (`isActive`),
  INDEX `idx_users_role` (`role`)
);

-- 2) Admin profile table (own PK)
CREATE TABLE `Admin` (
  `adminId` INT PRIMARY KEY AUTO_INCREMENT,
  `userId` INT NOT NULL,

  `firstName` VARCHAR(100) NOT NULL,
  `lastName`  VARCHAR(100) NOT NULL,
  `phone`     VARCHAR(50) NULL,

  `adminLevel` ENUM('SUPER','STANDARD') NOT NULL DEFAULT 'STANDARD',

  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY `uq_admin_user` (`userId`),
  INDEX `idx_admin_name` (`lastName`, `firstName`),

  CONSTRAINT `fk_admin_user` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- 3) Coach profile table (own PK)
CREATE TABLE `Coach` (
  `coachId` INT PRIMARY KEY AUTO_INCREMENT,
  `userId` INT NOT NULL,

  `firstName` VARCHAR(100) NOT NULL,
  `lastName`  VARCHAR(100) NOT NULL,
  `phone`     VARCHAR(50) NULL,
  `dateOfBirth` DATE NULL,

  `certification` VARCHAR(255) NULL,
  `experienceYears` INT NULL,
  `bio` TEXT NULL,

  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY `uq_coach_user` (`userId`),
  INDEX `idx_coach_name` (`lastName`, `firstName`),

  CONSTRAINT `fk_coach_user` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- 4) Student profile table (own PK)
CREATE TABLE `Student` (
  `studentId` INT PRIMARY KEY AUTO_INCREMENT,
  `userId` INT NOT NULL,

  `firstName` VARCHAR(100) NOT NULL,
  `lastName`  VARCHAR(100) NOT NULL,
  `preferredName` VARCHAR(100) NOT NULL,
  `phone`     VARCHAR(50) NULL,
  `dateOfBirth` DATE NULL,

  `skillLevel` ENUM('BEGINNER','INTERMEDIATE','ADVANCED') NULL,
  `notes` TEXT NULL,

  `emergencyContactName` VARCHAR(200) NULL,
  `emergencyContactPhone` VARCHAR(50) NULL,

  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY `uq_student_user` (`userId`),
  INDEX `idx_student_name` (`lastName`, `firstName`),

  CONSTRAINT `fk_student_user` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`)
    ON DELETE CASCADE ON UPDATE CASCADE
);


-- =========================================
-- COURSE SYSTEM 
-- =========================================

DROP TABLE IF EXISTS `SessionAttendance`;
DROP TABLE IF EXISTS `Enrollment`;
DROP TABLE IF EXISTS `Session`;
DROP TABLE IF EXISTS `Section`;
DROP TABLE IF EXISTS `Course`;
DROP TABLE IF EXISTS `Court`;

-- =========================
-- 1) Course
-- =========================
CREATE TABLE `Course` (
    `courseId`     INT PRIMARY KEY AUTO_INCREMENT,
    `name`         VARCHAR(100) NOT NULL,
    `courseNumber` VARCHAR(100) NOT NULL,
    `description`  TEXT,
    `level`        ENUM('BEGINNER','INTERMEDIATE','ADVANCED')
                    DEFAULT 'BEGINNER',
    `isActive`     BOOLEAN NOT NULL DEFAULT TRUE,

    UNIQUE KEY `uq_course_number` (`courseNumber`)
) ENGINE=InnoDB;


-- =========================
-- 2) Section
-- =========================
CREATE TABLE `Section` (
    `sectionId`     INT PRIMARY KEY AUTO_INCREMENT,
    `courseId`      INT NOT NULL,
    `coachId`       INT NOT NULL,

    `name`          VARCHAR(100),
    `syllabus`      TEXT,

    `startDate`     DATE,
    `endDate`       DATE,

    `maxStudents`   INT,

    `enrollmentMode` ENUM('FIXED','DROP_IN','HYBRID')
                      NOT NULL DEFAULT 'DROP_IN',

    `status`        ENUM('PLANNED','ACTIVE','FINISHED','CANCELLED')
                     NOT NULL DEFAULT 'PLANNED',

    `createdAt`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                                  ON UPDATE CURRENT_TIMESTAMP,

    INDEX `idx_section_course` (`courseId`),
    INDEX `idx_section_coach` (`coachId`),

    CONSTRAINT `fk_section_course`
      FOREIGN KEY (`courseId`) REFERENCES `Course`(`courseId`)
      ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT `fk_section_coach`
      FOREIGN KEY (`coachId`) REFERENCES `Coach`(`coachId`)
      ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =========================
-- 3) Court
-- =========================

CREATE TABLE `Court` (
    `courtId` INT AUTO_INCREMENT PRIMARY KEY,

    `name` VARCHAR(50) NOT NULL,

    `location` VARCHAR(100) NOT NULL,

    `surfaceType` ENUM('HARD', 'CLAY', 'GRASS', 'SYNTHETIC') NOT NULL,

    `isIndoor` BOOLEAN DEFAULT FALSE,

    `hasLighting` BOOLEAN DEFAULT TRUE,

    `status` ENUM('AVAILABLE', 'MAINTENANCE', 'CLOSED') DEFAULT 'AVAILABLE',

    UNIQUE(location, name)
);


-- =========================
-- 4) Session
-- =========================
CREATE TABLE `Session` (
    `sessionId`   INT AUTO_INCREMENT PRIMARY KEY,
    `sectionId`   INT NOT NULL,

    `startTime`   DATETIME NOT NULL,
    `endTime`     DATETIME NOT NULL,

    `location`    VARCHAR(100),
    `courtId`     INT NULL,

    `status`      ENUM('SCHEDULED','IN_PROGRESS','COMPLETED','CANCELLED')
                    NOT NULL DEFAULT 'SCHEDULED',

    `createdAt`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                               ON UPDATE CURRENT_TIMESTAMP,

    INDEX `idx_session_section` (`sectionId`),
    INDEX `idx_session_startTime` (`startTime`),
    INDEX `idx_session_court` (`courtId`),

    CONSTRAINT `fk_session_section`
      FOREIGN KEY (`sectionId`) REFERENCES `Section`(`sectionId`)
      ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT `fk_session_court`
      FOREIGN KEY (`courtId`) REFERENCES `Court`(`courtId`)
      ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =========================
-- 5) Section Enrollment 
-- =========================
CREATE TABLE `Enrollment` (
    `studentId`  INT NOT NULL,
    `sectionId`  INT NOT NULL,

    `status`     ENUM('ENROLLED','DROPPED','COMPLETED')
                   NOT NULL DEFAULT 'ENROLLED',

    `createdAt`  DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`studentId`, `sectionId`),

    INDEX `idx_enrollment_section` (`sectionId`),

    CONSTRAINT `fk_enrollment_student`
      FOREIGN KEY (`studentId`) REFERENCES `Student`(`studentId`)
      ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT `fk_enrollment_section`
      FOREIGN KEY (`sectionId`) REFERENCES `Section`(`sectionId`)
      ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =========================
-- 6) Session Attendance 
-- =========================
CREATE TABLE `SessionAttendance` (
    `sessionId` INT NOT NULL,
    `studentId` INT NOT NULL,

    `status` ENUM('ENROLLED','PRESENT','LATE','ABSENT','EXCUSED','CANCELLED')
              NOT NULL DEFAULT 'ENROLLED',

    `source` ENUM('SECTION','DROP_IN','ADMIN')
              NOT NULL DEFAULT 'DROP_IN',

    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`sessionId`, `studentId`),

    INDEX `idx_sa_student` (`studentId`),
    INDEX `idx_sa_status` (`status`),

    CONSTRAINT `fk_sa_session`
      FOREIGN KEY (`sessionId`) REFERENCES `Session`(`sessionId`)
      ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT `fk_sa_student`
      FOREIGN KEY (`studentId`) REFERENCES `Student`(`studentId`)
      ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =========================================
-- TRAINING GROUP MODULE 
-- =========================================

DROP TABLE IF EXISTS `TrainingGroupMember`;
DROP TABLE IF EXISTS `TrainingGroup`;

-- =========================
-- 1) TrainingGroup
-- =========================
CREATE TABLE `TrainingGroup` (
    `groupId`     INT PRIMARY KEY AUTO_INCREMENT,

    `name`        VARCHAR(100) NOT NULL,

    `groupType`   ENUM('TRAINING_GROUP','CLASS_GROUP','CLUB_TEAM')
                   NOT NULL DEFAULT 'TRAINING_GROUP',

    `description` TEXT NULL,

    `isActive`    BOOLEAN NOT NULL DEFAULT TRUE,

    `createdAt`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                                 ON UPDATE CURRENT_TIMESTAMP,

    INDEX `idx_group_type` (`groupType`),
    INDEX `idx_group_active` (`isActive`)
) ENGINE=InnoDB;

-- =========================
-- 2) TrainingGroupMember
-- =========================
CREATE TABLE `TrainingGroupMember` (
    `groupId`    INT NOT NULL,
    `studentId`  INT NOT NULL,

    `startDate`  DATE NULL,
    `endDate`    DATE NULL,  -- NULL means still active in group

    `createdAt`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                               ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`groupId`, `studentId`),

    INDEX `idx_gm_student` (`studentId`),
    INDEX `idx_gm_dates` (`startDate`, `endDate`),

    CONSTRAINT `fk_gm_group`
      FOREIGN KEY (`groupId`) REFERENCES `TrainingGroup`(`groupId`)
      ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT `fk_gm_student`
      FOREIGN KEY (`studentId`) REFERENCES `Student`(`studentId`)
      ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT `chk_gm_dates`
      CHECK (`endDate` IS NULL OR `startDate` IS NULL OR `endDate` >= `startDate`)
) ENGINE=InnoDB;


-- =========================================
-- SESSION NOTES & ASSESSMENT (v1)
-- =========================================

DROP TABLE IF EXISTS `SessionAssessment`;
DROP TABLE IF EXISTS `SessionNote`;

-- =========================
-- 1) SessionNote 
-- =========================
CREATE TABLE `SessionNote` (
    `noteId`     INT PRIMARY KEY AUTO_INCREMENT,
    `sessionId`  INT NOT NULL,

    `authorUserId` INT NOT NULL,

    `title`      VARCHAR(200) NULL,
    `content`    TEXT NOT NULL,

    `createdAt`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                               ON UPDATE CURRENT_TIMESTAMP,

    INDEX `idx_note_session` (`sessionId`),
    INDEX `idx_note_author` (`authorUserId`),

    CONSTRAINT `fk_note_session`
      FOREIGN KEY (`sessionId`) REFERENCES `Session`(`sessionId`)
      ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT `fk_note_author_user`
      FOREIGN KEY (`authorUserId`) REFERENCES `Users`(`userId`)
      ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 2) SessionAssessment 
-- =========================
CREATE TABLE `SessionAssessment` (
    `assessmentId` INT PRIMARY KEY AUTO_INCREMENT,

    `sessionId`  INT NOT NULL,
    `studentId`  INT NOT NULL,

    `metric` ENUM(
        'FOREHAND',
        'BACKHAND',
        'SERVE',
        'VOLLEY',
        'FOOTWORK',
        'STAMINA',
        'STRATEGY',
        'MENTAL',
        'CONSISTENCY',
        'OTHER'
    ) NOT NULL DEFAULT 'OTHER',

    `score` TINYINT NULL,

    `comment` TEXT NULL,

    `assessorUserId` INT NOT NULL,

    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY `uq_assessment_unique` (`sessionId`, `studentId`, `metric`),

    INDEX `idx_assessment_session` (`sessionId`),
    INDEX `idx_assessment_student` (`studentId`),
    INDEX `idx_assessment_metric` (`metric`),
    INDEX `idx_assessment_assessor` (`assessorUserId`),

    CONSTRAINT `fk_assessment_session`
      FOREIGN KEY (`sessionId`) REFERENCES `Session`(`sessionId`)
      ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT `fk_assessment_student`
      FOREIGN KEY (`studentId`) REFERENCES `Student`(`studentId`)
      ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT `fk_assessment_assessor_user`
      FOREIGN KEY (`assessorUserId`) REFERENCES `Users`(`userId`)
      ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT `chk_assessment_score`
      CHECK (`score` IS NULL OR (`score` >= 1 AND `score` <= 10))
) ENGINE=InnoDB;


-- =========================================
-- TRAINING MATCH & SCORING (Final v2)
-- =========================================

DROP TABLE IF EXISTS `MatchSegment`;
DROP TABLE IF EXISTS `MatchSummary`;
DROP TABLE IF EXISTS `MatchSidePlayer`;
DROP TABLE IF EXISTS `TrainingMatch`;
DROP TABLE IF EXISTS `ScoringFormat`;

-- =========================
-- 1) ScoringFormat
-- =========================
CREATE TABLE `ScoringFormat` (
    `formatId`   INT PRIMARY KEY AUTO_INCREMENT,

    `name`       VARCHAR(100) NOT NULL,

    `formatType` ENUM('POINT_RACE','GAME_RACE','SET_MATCH')
                  NOT NULL,

    `pointsToWin` INT NULL,
    `winByTwo`    BOOLEAN NOT NULL DEFAULT TRUE,

    `gamesToWinSet` INT NULL,
    `setsToWinMatch` INT NULL,
    `tiebreakAt` INT NULL,

    `noAd`       BOOLEAN NOT NULL DEFAULT FALSE,

    `notes`      TEXT NULL,
    `isActive`   BOOLEAN NOT NULL DEFAULT TRUE,

    `createdAt`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                               ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY `uq_format_name` (`name`),
    INDEX `idx_format_type` (`formatType`)
) ENGINE=InnoDB;


-- =========================
-- 2) TrainingMatch
-- =========================
CREATE TABLE `TrainingMatch` (
    `matchId`   INT PRIMARY KEY AUTO_INCREMENT,
    `sessionId` INT NOT NULL,
    `formatId`  INT NOT NULL,

    `matchType` ENUM('SINGLES','DOUBLES')
                 NOT NULL DEFAULT 'SINGLES',

    `title`     VARCHAR(200) NULL,
    `notes`     TEXT NULL,

    `status`    ENUM('SCHEDULED','IN_PROGRESS','COMPLETED','CANCELLED')
                 NOT NULL DEFAULT 'SCHEDULED',

    `winnerSide` ENUM('A','B') NULL,

    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,

    INDEX `idx_match_session` (`sessionId`),
    INDEX `idx_match_type` (`matchType`),
    INDEX `idx_match_status` (`status`),

    CONSTRAINT `fk_match_session`
      FOREIGN KEY (`sessionId`) REFERENCES `Session`(`sessionId`)
      ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT `fk_match_format`
      FOREIGN KEY (`formatId`) REFERENCES `ScoringFormat`(`formatId`)
      ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =========================
-- 3) MatchSidePlayer
-- =========================
CREATE TABLE `MatchSidePlayer` (
    `matchId`   INT NOT NULL,
    `side`      ENUM('A','B') NOT NULL,
    `position`  TINYINT NOT NULL,   -- 1 or 2
    `studentId` INT NOT NULL,

    PRIMARY KEY (`matchId`, `side`, `position`),

    UNIQUE KEY `uq_match_student` (`matchId`, `studentId`),

    INDEX `idx_msp_student` (`studentId`),

    CONSTRAINT `fk_msp_match`
      FOREIGN KEY (`matchId`) REFERENCES `TrainingMatch`(`matchId`)
      ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT `fk_msp_student`
      FOREIGN KEY (`studentId`) REFERENCES `Student`(`studentId`)
      ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT `chk_msp_position`
      CHECK (`position` IN (1,2))
) ENGINE=InnoDB;


-- =========================
-- 4) MatchSummary
-- =========================
CREATE TABLE `MatchSummary` (
    `matchId` INT PRIMARY KEY,

    `finalScoreText` VARCHAR(100) NULL,
    `sideAScore` INT NULL,
    `sideBScore` INT NULL,

    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT `fk_summary_match`
      FOREIGN KEY (`matchId`) REFERENCES `TrainingMatch`(`matchId`)
      ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =========================
-- 5) MatchSegment
-- =========================
CREATE TABLE `MatchSegment` (
    `matchId` INT NOT NULL,
    `segmentNo` INT NOT NULL,

    `segmentType` ENUM('SET','TB','RACE')
                   NOT NULL DEFAULT 'SET',

    `sideAScore` INT NOT NULL DEFAULT 0,
    `sideBScore` INT NOT NULL DEFAULT 0,

    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`matchId`, `segmentNo`),

    INDEX `idx_segment_type` (`segmentType`),

    CONSTRAINT `fk_segment_match`
      FOREIGN KEY (`matchId`) REFERENCES `TrainingMatch`(`matchId`)
      ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;