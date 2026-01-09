// title
title Tadaa Secret Santa Event Data Model

// tables
users [icon: user, color: yellow] {
id uuid pk
email string unique
password_hash string
name string

// host | guest
role string
created_at timestamp
updated_at timestamp
}

events [icon: calendar, color: green] {
id uuid pk
host_id uuid
name string
description string

budget int
currency string

// created | invited | assigned | done
status string

// classic | scrap | custom
event_mode string

// chain | exchange | pick-order
draw_rule string

// wann passiert das event
event_date timestamp

// datum an welchem die Einladungen rausgehen
invitation_date timestamp

// datum an dem die teilnehmer zugewiesen werden
draft_date timestamp

created_at timestamp
updated_at timestamp
}

guests [icon: user-check, color: orange] {
id uuid pk
event_id uuid
name string
email string
// custom warnings advice for gift giver(s)
note_for_giver string
// declince message
decline_message string
invite_token uuid unique

// invited (default) | opened | accpeted | denied
invite_status string
received_at timestamp
opened_at timestamp

created_at timestamp
updated_at timestamp
}

interest_options [icon: star, color: pink] {
id uuid pk
name string unique
// every time this interest is chosen ++
usage_count int
created_at timestamp
updated_at timestamp
}

guest_interests [icon: heart, color: red] {
id uuid pk
guest_id uuid
interest_option_id uuid
created_at timestamp
}

assignments [icon: gift, color: purple] {
id uuid pk
event_id uuid
giver_guest_id uuid
receiver_guest_id uuid
created_at timestamp
}

guest_no_interests {
id uuid pk
guest_id uuid
interest_option_id uuid
created_at timestamp
}

// relationships
users.id > events.host_id

events.id > guests.event_id
events.id > assignments.event_id

guests.id > assignments.giver_guest_id
guests.id > assignments.receiver_guest_id
guests.id > guest_interests.guest_id

interest_options.id > guest_interests.interest_option_id
guests.id > guest_no_interests.guest_id
interest_options.id > guest_no_interests.interest_option_id
