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