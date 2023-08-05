const { JWT } = require("google-auth-library");
const { calendar_v3 } = require("@googleapis/calendar");
const Calander = calendar_v3.Calendar;
const credential = require("./service-account.json");


// For more detail you can visit https://developers.google.com/calendar/api/v3/reference/events
const createEvent = async () => {
  try {
    const requestId = Math.floor(Math.random() * 100000);

    // Making auth object to tell that we are authenticated and for authentication purpose we are using info from service-accoun.json file
    const auth = new JWT(
      credential.client_email,
      null,
      credential.private_key,
      ["https://www.googleapis.com/auth/calendar"],
      "testGoogleAdimin@domain.app", // You google admin account email will come here....
      credential.client_id
    );

    const calendar = new Calander({ version: "v3", auth });

    const event = {
      summary: "Appointment",
      description: "Meeting with client",
    //   Start time for meeting
      start: {
        dateTime: "2023-07-19T12:00:00",
        timeZone: "America/Los_Angeles",
      },
    //   End time for meeting
      end: {
        dateTime: "2023-07-19T12:30:00",
        timeZone: "America/Los_Angeles",
      },
    //   conferenceData is  the object inwhich we specify all meeting link related things.
      conferenceData: {
        createRequest: {
          requestId,
          conferenceSolutionKey: {
            type: "hangoutsMeet", // Type can be amon these eventHangout,eventNamedHangout,hangoutsMeet,addOn
          },
        },
      },
    //   Participants who can join.
      attendees: [{ email: "test.user@gmail.com" },{ email: "test.2.user@gmail.com" }],
    };

    // Inserting event this will also add event to attendees calander as we are using google admin account email and service-account.json
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    console.log("Google Meet link: %s", response.data.hangoutLink);

    return;
  } catch (error) {
    console.log(error);
  }
};

createEvent();
