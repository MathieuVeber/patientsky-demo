# PatientSky assignment

## Installation

Clone this repo and install dependencies:

```
git clone https://github.com/MathieuVeber/patientsky-demo
// OR
git clone git@github.com:MathieuVeber/patientsky-demo.git

cd patientsky-demo/
yarn install
```

## Run locally

### Usage

`$ yarn start -i <id> ... <id> -p <ISO8601>/<ISO8601>`

| Options      | Alias | Required | Description                                     |
| ------------ | ----- | -------- | ----------------------------------------------- |
| `--ids`      | `-i`  | yes      | List of calendars ids to be searched            |
| `--period`   | `-p`  | yes      | A period within to find availability            |
| `--duration` | `-d`  | no       | Duration in minutes of the meeting. Default: 60 |

### Example

You can copy/paste this example to save some time:

```
yarn start -i 48cadf26-975e-11e5-b9c2-c8e0eb18c1e9 452dccfc-975e-11e5-bfa5-c8e0eb18c1e9 48644c7a-975e-11e5-a090-c8e0eb18c1e9 -p 2019-03-01T13:00:00Z/2019-05-11T15:30:00Z
```

And you should see this as a result:

```
7 available slots
    - for a 60 minutes meeting
    - with 48cadf26-975e-11e5-b9c2-c8e0eb18c1e9,452dccfc-975e-11e5-bfa5-c8e0eb18c1e9,48644c7a-975e-11e5-a090-c8e0eb18c1e9
    - between 2019-03-01T13:00:00.000Z and 2019-05-11T15:30:00.000Z

{ start: '2019-04-23T06:00:00.000Z', end: '2019-04-23T10:15:00.000Z' }
{ start: '2019-04-23T10:30:00.000Z', end: '2019-04-23T18:00:00.000Z' }
{ start: '2019-04-24T06:00:00.000Z', end: '2019-04-24T07:45:00.000Z' }
{ start: '2019-04-24T08:15:00.000Z', end: '2019-04-24T18:00:00.000Z' }
{ start: '2019-04-25T06:30:00.000Z', end: '2019-04-25T18:00:00.000Z' }
{ start: '2019-04-26T06:45:00.000Z', end: '2019-04-26T18:00:00.000Z' }
{ start: '2019-04-27T06:45:00.000Z', end: '2019-04-27T18:00:00.000Z' }
```

## Limits of the algorithm

- Time slots related to a single calendar cannot overlap
- Time slots ids are not preserved for the output (and therefore cannot be used to hypothetically book the slot).
