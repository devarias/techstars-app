import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CSVReader } from 'react-papaparse';
import { Button, Space } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { Progress } from 'antd';
import { CSVDownloader } from 'react-papaparse';
import '../styles/UploadFile.css';

const bluePrint = [
  {
    Name: 'Aaron Schram',
    Email: 'aaron@example.com',
    Day: 'Monday',
    'AM/PM': 'PM',
    'Company 2': 'Avengers Inc',
    'Company 3': 'Pied Piper',
    'Company 4': 'SHIELD ',
    'Company 5': 'Acme',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
    Companies: 'Avengers Inc',
    Contact: 'avengers@example.com',
  },
  {
    Name: 'Adam Burrows',
    Email: 'adam@example.com',
    Day: 'Friday',
    'AM/PM': 'AM',
    'Company 2': 'Wayne Industries',
    'Company 3': 'X Men ',
    'Company 4': 'Pied Piper',
    'Company 5': 'Xavier Corp',
    'Company 6': 'Justice League',
    'Company 7': 'Umbrella Corp',
    'Company 8': '',
    Companies: 'Pied Piper',
    Contact: 'pied@example.com',
  },
  {
    Name: 'Alex Raymond',
    Email: 'alex@example.com',
    Day: 'Thursday',
    'AM/PM': 'PM',
    'Company 2': 'Wayne Industries',
    'Company 3': 'Justice League',
    'Company 4': 'Xavier Corp',
    'Company 5': 'SHIELD ',
    'Company 6': 'Umbrella Corp',
    'Company 7': 'Pied Piper',
    'Company 8': 'Avengers Inc',
    Companies: 'SHIELD',
    Contact: 'shield@example.com',
  },
  {
    Name: 'Amy Kim',
    Email: 'amy@example.com',
    Day: 'Undefined ',
    'AM/PM': 'Undefined ',
    'Company 2': 'X Men ',
    'Company 3': 'Olympus',
    'Company 4': 'Pied Piper',
    'Company 5': 'Marvel',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
    Companies: 'Acme',
    Contact: 'acme@example.com',
  },
  {
    Name: 'Andrea Kalmans',
    Email: 'andrea@example.com',
    Day: 'Wednesday',
    'AM/PM': 'PM',
    'Company 2': 'Wayne Industries',
    'Company 3': 'Umbrella Corp',
    'Company 4': 'Marvel',
    'Company 5': 'Avengers Inc',
    'Company 6': 'Justice League',
    'Company 7': 'Acme',
    'Company 8': '',
    Companies: 'X Men',
    Contact: 'xmen@example.com',
  },
  {
    Name: 'Anthony Christie',
    Email: 'anthony@example.com',
    Day: 'Tuesday',
    'AM/PM': 'PM',
    'Company 2': 'Acme',
    'Company 3': 'Pied Piper',
    'Company 4': 'Justice League',
    'Company 5': 'Marvel',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
    Companies: 'Xavier Corp',
    Contact: 'xavier@example.com',
  },
  {
    Name: 'Ara Howard',
    Email: 'ara@example.com',
    Day: 'Wednesday',
    'AM/PM': 'AM',
    'Company 2': 'Justice League',
    'Company 3': 'Pied Piper',
    'Company 4': 'SHIELD ',
    'Company 5': '',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
    Companies: 'Wayne Industries',
    Contact: 'wayne@example.com',
  },
  {
    Name: 'Bart Foster',
    Email: 'bart@example.com',
    Day: 'Thursday',
    'AM/PM': 'PM',
    'Company 2': 'Olympus',
    'Company 3': 'Pied Piper',
    'Company 4': 'Justice League',
    'Company 5': 'Marvel',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
    Companies: 'Justice League',
    Contact: 'justice@example.com',
  },
  {
    Name: 'Ben Hadley',
    Email: 'ben@example.com',
    Day: 'Thursday',
    'AM/PM': 'PM',
    'Company 2': 'Olympus',
    'Company 3': 'Justice League',
    'Company 4': 'Pied Piper',
    'Company 5': 'Xavier Corp',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
    Companies: 'Umbrella Corp',
    Contact: 'umbrella@example.com',
  },
  {
    Name: 'Blake Yeager',
    Email: 'blake@example.com',
    Day: 'Tuesday',
    'AM/PM': 'PM',
    'Company 2': 'Justice League',
    'Company 3': 'Pied Piper',
    'Company 4': 'SHIELD ',
    'Company 5': 'Xavier Corp',
    'Company 6': 'Umbrella Corp',
    'Company 7': 'Marvel',
    'Company 8': '',
    Companies: 'Olympus',
    Contact: 'olympus@example.com',
  },
  {
    Name: 'Brett Jackson',
    Email: 'brett@example.com',
    Day: 'Tuesday',
    'AM/PM': 'PM',
    'Company 2': 'Avengers Inc',
    'Company 3': 'Wayne Industries',
    'Company 4': 'Justice League',
    'Company 5': 'Xavier Corp',
    'Company 6': 'Marvel',
    'Company 7': '',
    'Company 8': '',
    Companies: 'Marvel',
    Contact: 'marvel@example.com',
  },
  {
    Name: 'Brian Wallace',
    Email: 'brian@example.com',
    Day: 'Undefined ',
    'AM/PM': 'Undefined ',
    'Company 2': 'X Men ',
    'Company 3': 'Justice League',
    'Company 4': 'Pied Piper',
    'Company 5': 'Xavier Corp',
    'Company 6': 'Olympus',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Cheryl Kellond',
    Email: 'cheryl@example.com',
    Day: 'Undefined ',
    'AM/PM': 'Undefined ',
    'Company 2': 'Umbrella Corp',
    'Company 3': 'Wayne Industries',
    'Company 4': 'SHIELD ',
    'Company 5': '',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Chris Marks',
    Email: 'chris@example.com',
    Day: 'Tuesday',
    'AM/PM': 'PM',
    'Company 2': 'Justice League',
    'Company 3': 'Xavier Corp',
    'Company 4': 'X Men ',
    'Company 5': 'Olympus',
    'Company 6': 'Marvel',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Daniel Feld',
    Email: 'daniel@example.com',
    Day: 'Friday',
    'AM/PM': 'AM',
    'Company 2': 'Avengers Inc',
    'Company 3': 'Olympus',
    'Company 4': 'Pied Piper',
    'Company 5': 'Marvel',
    'Company 6': 'Umbrella Corp',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Dave Dupont',
    Email: 'dave@example.com',
    Day: 'Friday',
    'AM/PM': 'AM',
    'Company 2': 'Wayne Industries',
    'Company 3': 'SHIELD ',
    'Company 4': 'Avengers Inc',
    'Company 5': '',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Dave Secunda',
    Email: 'daves@example.com',
    Day: 'Friday',
    'AM/PM': 'AM',
    'Company 2': 'Umbrella Corp',
    'Company 3': 'Olympus',
    'Company 4': 'Pied Piper',
    'Company 5': '',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Dave Wright',
    Email: 'davew@example.com',
    Day: 'Friday',
    'AM/PM': 'AM',
    'Company 2': 'Acme',
    'Company 3': 'Justice League',
    'Company 4': 'Pied Piper',
    'Company 5': 'SHIELD ',
    'Company 6': 'Avengers Inc',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'David Cahill',
    Email: 'david@example.com',
    Day: 'Wednesday',
    'AM/PM': 'PM',
    'Company 2': 'Pied Piper',
    'Company 3': 'Acme',
    'Company 4': 'SHIELD ',
    'Company 5': 'Xavier Corp',
    'Company 6': 'Umbrella Corp',
    'Company 7': 'Marvel',
    'Company 8': '',
  },
  {
    Name: 'David Hose',
    Email: 'davidh@example.com',
    Day: 'Tuesday',
    'AM/PM': 'AM',
    'Company 2': 'Wayne Industries',
    'Company 3': 'Olympus',
    'Company 4': '',
    'Company 5': '',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Don Hazell',
    Email: 'don@example.com',
    Day: 'Tuesday',
    'AM/PM': 'PM',
    'Company 2': 'Wayne Industries',
    'Company 3': 'Pied Piper',
    'Company 4': 'Justice League',
    'Company 5': 'SHIELD ',
    'Company 6': 'Xavier Corp',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Don Loeb',
    Email: 'donl@example.com',
    Day: 'Thursday',
    'AM/PM': 'PM',
    'Company 2': 'Acme',
    'Company 3': 'Wayne Industries',
    'Company 4': 'Marvel',
    'Company 5': '',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Ed Hallen',
    Email: 'ed@example.com',
    Day: 'Wednesday',
    'AM/PM': 'PM',
    'Company 2': 'Umbrella Corp',
    'Company 3': 'Xavier Corp',
    'Company 4': 'SHIELD ',
    'Company 5': 'X Men ',
    'Company 6': 'Justice League',
    'Company 7': 'Pied Piper',
    'Company 8': 'Marvel',
  },
  {
    Name: 'Ed Roberto',
    Email: 'edr@example.com',
    Day: 'Undefined ',
    'AM/PM': 'Undefined ',
    'Company 2': 'X Men ',
    'Company 3': 'Acme',
    'Company 4': 'SHIELD ',
    'Company 5': '',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Eric Kirby',
    Email: 'eric@example.com',
    Day: 'Monday',
    'AM/PM': 'PM',
    'Company 2': 'Acme',
    'Company 3': 'Justice League',
    'Company 4': 'Pied Piper',
    'Company 5': 'Xavier Corp',
    'Company 6': 'SHIELD ',
    'Company 7': 'Avengers Inc',
    'Company 8': '',
  },
  {
    Name: 'Erin Rand',
    Email: 'erin@example.com',
    Day: 'Tuesday',
    'AM/PM': 'PM',
    'Company 2': 'Avengers Inc',
    'Company 3': 'Marvel',
    'Company 4': 'X Men ',
    'Company 5': 'Acme',
    'Company 6': 'SHIELD ',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Fletcher Richman',
    Email: 'fletcher@example.com',
    Day: 'Tuesday',
    'AM/PM': 'AM',
    'Company 2': 'Pied Piper',
    'Company 3': 'Olympus',
    'Company 4': 'Xavier Corp',
    'Company 5': '',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'George Bilbrey',
    Email: 'george@example.com',
    Day: 'Undefined ',
    'AM/PM': 'Undefined ',
    'Company 2': 'Pied Piper',
    'Company 3': 'Xavier Corp',
    'Company 4': 'SHIELD ',
    'Company 5': '',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Hernan Aracena',
    Email: 'hernan@example.com',
    Day: 'Wednesday',
    'AM/PM': 'PM',
    'Company 2': 'Olympus',
    'Company 3': 'X Men ',
    'Company 4': 'SHIELD ',
    'Company 5': 'Acme',
    'Company 6': 'Marvel',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Howard Kaushansky',
    Email: 'howard@example.com',
    Day: 'Wednesday',
    'AM/PM': 'PM',
    'Company 2': 'Acme',
    'Company 3': 'Xavier Corp',
    'Company 4': 'Umbrella Corp',
    'Company 5': 'Justice League',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Ivan Lopez',
    Email: 'ivan@example.com',
    Day: 'Tuesday',
    'AM/PM': 'AM',
    'Company 2': 'Olympus',
    'Company 3': 'Xavier Corp',
    'Company 4': 'Acme',
    'Company 5': 'SHIELD ',
    'Company 6': 'Pied Piper',
    'Company 7': 'Umbrella Corp',
    'Company 8': '',
  },
  {
    Name: 'Jackie Young',
    Email: 'jackie@example.com',
    Day: 'Tuesday',
    'AM/PM': 'AM',
    'Company 2': 'Wayne Industries',
    'Company 3': 'Marvel',
    'Company 4': 'Umbrella Corp',
    'Company 5': 'X Men ',
    'Company 6': 'Olympus',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Jackson Carson',
    Email: 'jackson@example.com',
    Day: 'Monday',
    'AM/PM': 'PM',
    'Company 2': 'Avengers Inc',
    'Company 3': 'Pied Piper',
    'Company 4': 'Justice League',
    'Company 5': 'Umbrella Corp',
    'Company 6': 'Acme',
    'Company 7': 'Marvel',
    'Company 8': '',
  },
  {
    Name: 'Jeremy Dillingham',
    Email: 'jeremy@example.com',
    Day: 'Wednesday',
    'AM/PM': 'AM',
    'Company 2': 'Xavier Corp',
    'Company 3': 'SHIELD ',
    'Company 4': 'Avengers Inc',
    'Company 5': '',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Jim Franklin',
    Email: 'jim@example.com',
    Day: 'Monday',
    'AM/PM': 'PM',
    'Company 2': 'Acme',
    'Company 3': 'Umbrella Corp',
    'Company 4': 'Marvel',
    'Company 5': '',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Jonathan Palay',
    Email: 'jonathan@example.com',
    Day: 'Undefined ',
    'AM/PM': 'Undefined ',
    'Company 2': 'Wayne Industries',
    'Company 3': 'Justice League',
    'Company 4': 'SHIELD ',
    'Company 5': '',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Josh Scott',
    Email: 'josh@example.com',
    Day: 'Tuesday',
    'AM/PM': 'PM',
    'Company 2': 'Avengers Inc',
    'Company 3': 'Olympus',
    'Company 4': 'X Men ',
    'Company 5': 'Acme',
    'Company 6': 'Umbrella Corp',
    'Company 7': 'Marvel',
    'Company 8': '',
  },
  {
    Name: 'Julie Penner',
    Email: 'julie@example.com',
    Day: 'Monday',
    'AM/PM': 'PM',
    'Company 2': 'Avengers Inc',
    'Company 3': 'Justice League',
    'Company 4': 'X Men ',
    'Company 5': 'Olympus',
    'Company 6': 'Pied Piper',
    'Company 7': 'Marvel',
    'Company 8': 'Umbrella Corp',
  },
  {
    Name: 'Justin Segall',
    Email: 'justin@example.com',
    Day: 'Undefined ',
    'AM/PM': 'Undefined ',
    'Company 2': 'Pied Piper',
    'Company 3': 'SHIELD ',
    'Company 4': 'Justice League',
    'Company 5': 'Acme',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Kathy Keating',
    Email: 'kathy@example.com',
    Day: 'Wednesday',
    'AM/PM': 'PM',
    'Company 2': 'Xavier Corp',
    'Company 3': 'Avengers Inc',
    'Company 4': 'Acme',
    'Company 5': 'Wayne Industries',
    'Company 6': 'Umbrella Corp',
    'Company 7': 'Marvel',
    'Company 8': '',
  },
  {
    Name: 'Keely Cormier',
    Email: 'keely@example.com',
    Day: 'Wednesday',
    'AM/PM': 'PM',
    'Company 2': 'Olympus',
    'Company 3': 'X Men ',
    'Company 4': 'Avengers Inc',
    'Company 5': 'SHIELD ',
    'Company 6': 'Marvel',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Kirsten Suddath',
    Email: 'kirsten@example.com',
    Day: 'Thursday',
    'AM/PM': 'PM',
    'Company 2': 'Olympus',
    'Company 3': 'X Men ',
    'Company 4': 'Umbrella Corp',
    'Company 5': 'Avengers Inc',
    'Company 6': 'Justice League',
    'Company 7': 'Marvel',
    'Company 8': '',
  },
  {
    Name: 'Kyle Kuczun',
    Email: 'kyle@example.com',
    Day: 'Thursday',
    'AM/PM': 'AM',
    'Company 2': 'Avengers Inc',
    'Company 3': 'Pied Piper',
    'Company 4': 'Xavier Corp',
    'Company 5': 'SHIELD ',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Matthew Klein',
    Email: 'matthew@example.com',
    Day: 'Wednesday',
    'AM/PM': 'PM',
    'Company 2': 'X Men ',
    'Company 3': 'Pied Piper',
    'Company 4': 'Xavier Corp',
    'Company 5': 'Marvel',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Matthew Loewengart',
    Email: 'matthewl@example.com',
    Day: 'Undefined ',
    'AM/PM': 'Undefined ',
    'Company 2': 'Olympus',
    'Company 3': 'X Men ',
    'Company 4': 'Acme',
    'Company 5': '',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Miguel Roque',
    Email: 'miguel@example.com',
    Day: 'Friday',
    'AM/PM': 'AM',
    'Company 2': 'Xavier Corp',
    'Company 3': 'X Men ',
    'Company 4': 'Olympus',
    'Company 5': 'Acme',
    'Company 6': 'Umbrella Corp',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Mindy Nies',
    Email: 'mindy@example.com',
    Day: 'Tuesday',
    'AM/PM': 'PM',
    'Company 2': 'Umbrella Corp',
    'Company 3': 'SHIELD ',
    'Company 4': 'X Men ',
    'Company 5': 'Justice League',
    'Company 6': 'Olympus',
    'Company 7': 'Marvel',
    'Company 8': '',
  },
  {
    Name: 'Morris Wheeler',
    Email: 'morris@example.com',
    Day: 'Thursday',
    'AM/PM': 'AM',
    'Company 2': 'SHIELD ',
    'Company 3': 'Xavier Corp',
    'Company 4': 'Acme',
    'Company 5': '',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Nancy Beaton',
    Email: 'nancy@example.com',
    Day: 'Thursday',
    'AM/PM': 'PM',
    'Company 2': 'Umbrella Corp',
    'Company 3': 'Olympus',
    'Company 4': 'X Men ',
    'Company 5': 'Acme',
    'Company 6': 'Marvel',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Natty Zola',
    Email: 'natty@example.com',
    Day: 'Tuesday',
    'AM/PM': 'PM',
    'Company 2': 'X Men ',
    'Company 3': 'Xavier Corp',
    'Company 4': 'Avengers Inc',
    'Company 5': 'Umbrella Corp',
    'Company 6': 'Wayne Industries',
    'Company 7': 'SHIELD ',
    'Company 8': 'Marvel',
  },
  {
    Name: 'Nick Hofmeister',
    Email: 'nick@example.com',
    Day: 'Monday',
    'AM/PM': 'PM',
    'Company 2': 'Wayne Industries',
    'Company 3': 'Olympus',
    'Company 4': 'Xavier Corp',
    'Company 5': 'X Men ',
    'Company 6': 'Marvel',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Nicko van Someren',
    Email: 'nicko@example.com',
    Day: 'Monday',
    'AM/PM': 'PM',
    'Company 2': 'Pied Piper',
    'Company 3': 'Xavier Corp',
    'Company 4': 'SHIELD ',
    'Company 5': 'Wayne Industries',
    'Company 6': 'Umbrella Corp',
    'Company 7': 'Marvel',
    'Company 8': '',
  },
  {
    Name: 'Niko Skievaski',
    Email: 'niko@example.com',
    Day: 'Wednesday',
    'AM/PM': 'AM',
    'Company 2': 'Xavier Corp',
    'Company 3': 'Pied Piper',
    'Company 4': 'SHIELD ',
    'Company 5': 'Acme',
    'Company 6': 'Avengers Inc',
    'Company 7': 'Justice League',
    'Company 8': '',
  },
  {
    Name: 'Nmachi Jidenma',
    Email: 'nmachhi@example.com',
    Day: 'Undefined ',
    'AM/PM': 'Undefined ',
    'Company 2': 'Olympus',
    'Company 3': 'Marvel',
    'Company 4': 'X Men ',
    'Company 5': 'Avengers Inc',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Pascal Wagner',
    Email: 'pascal@example.com',
    Day: 'Thursday',
    'AM/PM': 'PM',
    'Company 2': 'SHIELD ',
    'Company 3': 'Xavier Corp',
    'Company 4': 'Marvel',
    'Company 5': '',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Phil Carter',
    Email: 'phil@example.com',
    Day: 'Wednesday',
    'AM/PM': 'AM',
    'Company 2': 'X Men ',
    'Company 3': 'Olympus',
    'Company 4': 'Pied Piper',
    'Company 5': 'Xavier Corp',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Rachel Fleming',
    Email: 'rachel@example.com',
    Day: 'Friday',
    'AM/PM': 'AM',
    'Company 2': 'Umbrella Corp',
    'Company 3': 'X Men ',
    'Company 4': 'Wayne Industries',
    'Company 5': '',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Rachel ten Brink',
    Email: 'rachel@example.com',
    Day: 'Tuesday',
    'AM/PM': 'AM',
    'Company 2': 'Olympus',
    'Company 3': 'Avengers Inc',
    'Company 4': 'SHIELD ',
    'Company 5': 'Acme',
    'Company 6': 'Umbrella Corp',
    'Company 7': 'Marvel',
    'Company 8': '',
  },
  {
    Name: 'Rich Maloy',
    Email: 'rich@example.com',
    Day: 'Friday',
    'AM/PM': 'AM',
    'Company 2': 'Wayne Industries',
    'Company 3': 'Pied Piper',
    'Company 4': 'Justice League',
    'Company 5': 'Avengers Inc',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Rodrigo Sanchez-Rios',
    Email: 'rodrigo@example.com',
    Day: 'Undefined ',
    'AM/PM': 'Undefined ',
    'Company 2': 'SHIELD ',
    'Company 3': 'Marvel',
    'Company 4': '',
    'Company 5': '',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Ryan Broshar',
    Email: 'ryan@example.com',
    Day: 'Monday',
    'AM/PM': 'PM',
    'Company 2': 'X Men ',
    'Company 3': 'Wayne Industries',
    'Company 4': 'Pied Piper',
    'Company 5': 'Xavier Corp',
    'Company 6': 'Justice League',
    'Company 7': 'Marvel',
    'Company 8': 'Umbrella Corp',
  },
  {
    Name: 'Ryan Hunter',
    Email: 'ryanh@example.com',
    Day: 'Wednesday',
    'AM/PM': 'PM',
    'Company 2': 'Olympus',
    'Company 3': 'Umbrella Corp',
    'Company 4': 'Marvel',
    'Company 5': '',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Sam Laakkonen',
    Email: 'sam@example.com',
    Day: 'Wednesday',
    'AM/PM': 'PM',
    'Company 2': 'X Men ',
    'Company 3': 'Olympus',
    'Company 4': 'Acme',
    'Company 5': 'SHIELD ',
    'Company 6': 'Justice League',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Sara Zervos',
    Email: 'sara@example.com',
    Day: 'Thursday',
    'AM/PM': 'PM',
    'Company 2': 'Umbrella Corp',
    'Company 3': 'Avengers Inc',
    'Company 4': 'Justice League',
    'Company 5': 'Wayne Industries',
    'Company 6': 'Marvel',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Sasha Charlemagne',
    Email: 'sasha@example.com',
    Day: 'Wednesday',
    'AM/PM': 'AM',
    'Company 2': 'SHIELD ',
    'Company 3': 'X Men ',
    'Company 4': 'Marvel',
    'Company 5': 'Umbrella Corp',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Scott Yates',
    Email: 'scott@example.com',
    Day: 'Friday',
    'AM/PM': 'AM',
    'Company 2': 'SHIELD ',
    'Company 3': 'Justice League',
    'Company 4': 'Xavier Corp',
    'Company 5': 'Wayne Industries',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Shay Har-Noy',
    Email: 'shay@example.com',
    Day: 'Monday',
    'AM/PM': 'PM',
    'Company 2': 'Justice League',
    'Company 3': 'Wayne Industries',
    'Company 4': 'Pied Piper',
    'Company 5': 'Xavier Corp',
    'Company 6': 'Avengers Inc',
    'Company 7': 'Marvel',
    'Company 8': '',
  },
  {
    Name: 'Stephan Hagemann',
    Email: 'stephan@example.com',
    Day: 'Thursday',
    'AM/PM': 'AM',
    'Company 2': 'Justice League',
    'Company 3': 'Avengers Inc',
    'Company 4': 'Pied Piper',
    'Company 5': 'Xavier Corp',
    'Company 6': 'SHIELD ',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Sue Heilbronner',
    Email: 'sue@example.com',
    Day: 'Tuesday',
    'AM/PM': 'PM',
    'Company 2': 'Umbrella Corp',
    'Company 3': 'Olympus',
    'Company 4': 'X Men ',
    'Company 5': 'Justice League',
    'Company 6': 'SHIELD ',
    'Company 7': 'Marvel',
    'Company 8': '',
  },
  {
    Name: 'Tanner McGraw',
    Email: 'tanner@example.com',
    Day: 'Undefined ',
    'AM/PM': 'Undefined ',
    'Company 2': 'Xavier Corp',
    'Company 3': 'Acme',
    'Company 4': 'Justice League',
    'Company 5': 'SHIELD ',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Tim Miller',
    Email: 'tim@example.com',
    Day: 'Thursday',
    'AM/PM': 'PM',
    'Company 2': 'Justice League',
    'Company 3': 'Wayne Industries',
    'Company 4': 'Avengers Inc',
    'Company 5': 'Pied Piper',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Toby Yoder',
    Email: 'toby@example.com',
    Day: 'Thursday',
    'AM/PM': 'PM',
    'Company 2': 'Umbrella Corp',
    'Company 3': 'Pied Piper',
    'Company 4': 'Wayne Industries',
    'Company 5': '',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Vijay Bangaru',
    Email: 'vijay@example.com',
    Day: 'Undefined ',
    'AM/PM': 'Undefined ',
    'Company 2': 'Pied Piper',
    'Company 3': 'SHIELD ',
    'Company 4': 'Xavier Corp',
    'Company 5': '',
    'Company 6': '',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: 'Zach Nies',
    Email: 'zach@example.com',
    Day: 'Wednesday',
    'AM/PM': 'AM',
    'Company 2': 'Acme',
    'Company 3': 'Justice League',
    'Company 4': 'Avengers Inc',
    'Company 5': 'Pied Piper',
    'Company 6': 'Xavier Corp',
    'Company 7': '',
    'Company 8': '',
  },
  {
    Name: '',
  },
];
/**
 * UploadFile is the component to upload the CSV to generate the schedule
 * @setReschedule: this setter sends the response schedule data from the back-end to
 * be used to
 * build the datatable.
 * @setView: is used to redirect automatically from the generate meeting section to
 * the meeting table view
 */
const UploadFile = ({ setRechargeMeetings, setView }) => {
  /* isReset manages the unmounting process for the uploaded CSV file*/
  const [isReset, setIsReset] = useState(false);
  /* jsonData stores the data of the uploaded CSV */
  const [jsonData, setJsonData] = useState(null);
  /* fetched is used to know when the the generation of the schedule is done to redirect
   * the user to the scheduling table */
  const [fetched, setFetched] = useState(false);
  const [loading, setLoading] = useState(0);
  const [time, setTime] = useState(0);
  const [progress, setProgress] = useState(0);

  const message = [
    'Drop CSV file here or click to upload',
    <Progress type='circle' width={80} percent={progress} />,
  ];
  const history = useHistory();

  /* This effect redirects from this component to the table schedule view and cleans 
  this component*/
  useEffect(() => {
    if (fetched === true) {
      history.push('/MeetingsTable');
      setRechargeMeetings(true);
      setView(5);
    }
    return () => {};
  }, [fetched]);

  useEffect(() => {
    if (loading === 1) {
      const intervalId = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1500);
      setProgress((prev) => prev + 5);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [loading, time]);

  /* This funtions handles the actions when a CSV file is uploaded */
  const handleOnDrop = (data) => {
    const data_list = data.map((row) => row.data);
    setJsonData(JSON.stringify(data_list));
  };

  /* This function handles Error with the uploaded file */
  const handleOnError = (err, file, inputElem, reason) => {
    alert(err);
    setIsReset(true);
    setIsReset(false);
    setJsonData(null);
    alert('Error: %s', reason);
  };

  /* Removes the file from the front-end to allow the upload of another file 
  or when an error ocurred */
  const handleOnRemoveFile = (data) => {
    setIsReset(true);
    setIsReset(false);
    setJsonData(null);
  };

  /* Handles the querying to the back-end to generate the shedule*/
  const handleSubmit = () => {
    if (jsonData !== null) {
      if (
        window.confirm(
          'A new meeting schedule is going to be generated\nand the actual schedule will be erased permanently\nDo you want to continue?'
        )
      ) {
        setIsReset(true);
        setLoading(1);
        fetch(
          'https://techstars-api.herokuapp.com/api/schedule', //Route to send the CSV file to generate the schedule
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: jsonData,
          }
        )
          .then((response) => response.json())
          .then((result) => {
            /*result is the generated schedule without conflicts*/
            //setResSchedule(result);
            setIsReset(true);
            setIsReset(false);
            /* with this we call the use effect to redirect to other component and clean
              the actual component */
            setProgress(100);
            setFetched(true);
          })
          .catch((error) => {
            alert('File error, please see the example on the github repo');
            setIsReset(true);
            setIsReset(false);
            setJsonData(null);
            setLoading(0);
          });
      } else {
        setIsReset(true);
        setIsReset(false);
      }
    }
  };

  const handleSubmitButton = () => {
    if (jsonData !== null) {
      return (
        <Button
          id='buttonUpload'
          type='primary'
          shape='round'
          icon={<SendOutlined />}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      );
    }
  };
  return (
    <>
      <div className='downloadbutton'>
        <CSVDownloader
          className='buttonDownload'
          data={bluePrint}
          type={'button'}
          filename={'schedule blueprint'}
          style={{
            background: '#39C463',
            borderRadius: '5px',
            height: 32,
            disable: true,
          }}
          bom={true}
        >
          Download example file
        </CSVDownloader>
      </div>
      <div className='boxupload'>
        <CSVReader
          accept='text/csv, .csv, application/vnd.ms-excel'
          progressBarColor='#39C463'
          onDrop={handleOnDrop}
          onError={handleOnError}
          s
          addRemoveButton
          isReset={isReset}
          onRemoveFile={handleOnRemoveFile}
          config={{ header: true }}
          style={{
            dropArea: {
              borderColor: 'pink',
              height: 200,
              width: 400,
              borderRadius: 20,
            },
            dropAreaActive: {
              borderColor: 'red',
            },
            dropFile: {
              width: 100,
              height: 100,
              background: '#ccc',
            },
            fileSizeInfo: {
              color: '#000',
              backgroundColor: '#fff',
              borderRadius: 3,
              lineHeight: 1,
              marginBottom: '0.5em',
              padding: '0 0.4em',
            },
            fileNameInfo: {
              color: '#000',
              backgroundColor: '#fff',
              borderRadius: 3,
              fontSize: 14,
              lineHeight: 1,
              padding: '0 0.4em',
            },
            removeButton: {
              color: '#39C463',
            },
            progressBar: {
              backgroundColor: '#39C463',
            },
          }}
        >
          <span>{message[loading]}</span>
          {loading === 1 ? (
            <div style={{ marginTop: 5 }}>Please wait to be redirected</div>
          ) : null}
        </CSVReader>
      </div>
      <div className='buttonSubmit'>{handleSubmitButton()}</div>
    </>
  );
};

export default UploadFile;
