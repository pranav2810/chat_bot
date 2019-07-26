
## say Hello
* greet
  - utter_greet

## say goodbye
* goodbye
  - utter_goodbye


## say thanks
* thanks
    - utter_okay


## say deny
  * deny
      - utter_sorry


# ROOM BOOKING--------------------------------------------------------------------------------------

## happy path

* inform_room_booking
      - utter_query_room
      - action_extract
      - bookroom_form
      - form{"name": "bookroom_form"}
      - form{"name": null}
      - utter_submit_bookroom_form
      - action_slot_reset
      - utter_ask_send_mail


# send mail book rooms -affirm
* inform_room_booking
      - utter_query_room
      - action_extract
      - bookroom_form
      - form{"name": "bookroom_form"}
      - form{"name": null}
      - utter_submit_bookroom_form
      - action_slot_reset
      - utter_ask_send_mail
* affirm OR send_mail
      - utter_book_room_send_mail


##response after form
* inform_room_booking
      - utter_query_room
      - action_extract
      - bookroom_form
      - form{"name": "bookroom_form"}
      - form{"name": null}
      - utter_submit_bookroom_form
      - action_slot_reset
      - utter_ask_send_mail
* affirm OR send_mail
      - utter_book_room_send_mail
* ask_sla OR ask_roomBooking_sla
      - utter_roomBooking_sla


## form and capacity
##response after form
* inform_room_booking
      - utter_query_room
      - action_extract
      - bookroom_form
      - form{"name": "bookroom_form"}
      - form{"name": null}
      - utter_submit_bookroom_form
      - action_slot_reset
      - utter_ask_send_mail
* affirm OR send_mail
      - utter_book_room_send_mail
* ask_room_capacity
      - utter_conferenceRoom_capacity
      - utter_meetingRoom_capacity
# send mail book rooms- deny

* inform_room_booking
          - utter_query_room
          - action_extract
          - bookroom_form
          - form{"name": "bookroom_form"}
          - form{"name": null}
          - utter_submit_bookroom_form
          - action_slot_reset
          - utter_ask_send_mail
* deny
          - utter_okay

## ask sla book room
* ask_roomBooking_sla
    - utter_roomBooking_sla

## book a room , user asked rooms capacity

* ask_room_capacity
    - utter_meetingRoom_capacity
    - utter_conferenceRoom_capacity
## book a room , user asked rooms capacity
* ask_Mroom_capacity
    - utter_meetingRoom_capacity
## book a room , user asked rooms capacity
* ask_Croom_capacity
    - utter_conferenceRoom_capacity
## book a room , user asked rooms capacity
* ask_room_details
    - utter_conferenceRoom_capacity
    - utter_meetingRoom_capacity
    - utter_roomBooking_sla



# ASKING FOR ROOM BOOKING SLA AS " FIRST QUESTION "
* ask_roomBooking_sla
    - utter_roomBooking_sla


# AC SERVIVE-------------------------------------------------------------------------------------->
## sla
* ask_sla
  - utter_sorry
##  ac
  * ac_service
    - utter_ac_service

## sla of ac
* ac_service
    - utter_ac_service
* ask_sla OR ask_ac_sla
   - utter_ac_sla

# AC SLA AS FIRST QUESTION
* ask_ac_sla
   - utter_ac_sla


######  STATIONERY SEND MAIL
## stationery
  * stationery
    - utter_stationery_link
    - utter_stationery_ui

# stationery_ui send mail
* stationery
    - utter_stationery_link
    - utter_stationery_ui
* send_mail OR affirm
    - utter_stationery_send_mail


# stationery_ui send mail
    * stationery
        - utter_stationery_link
        - utter_stationery_ui
    * deny
        - utter_okay

#extra flow -book room
* ask_room_capacity
    - utter_meetingRoom_capacity
    - utter_conferenceRoom_capacity
