SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `ircMan` ;
CREATE SCHEMA IF NOT EXISTS `ircMan` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ;
SHOW WARNINGS;
USE `ircMan` ;

-- -----------------------------------------------------
-- Table `ircMan`.`messages`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `ircMan`.`messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `message` VARCHAR(500) NOT NULL ,
  `channel` VARCHAR(100) NOT NULL ,
  `from` VARCHAR(100) NOT NULL ,
  `fromIP` VARCHAR(50) ,
  `timeStamp` TIMESTAMP NOT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;

SHOW WARNINGS;