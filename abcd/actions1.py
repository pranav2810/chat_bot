from typing import Dict, Text, Any, List, Union, Optional
from rasa_sdk import Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.forms import FormAction
from rasa_sdk.events import AllSlotsReset
from rasa_sdk import Action
from rasa_sdk.events import SlotSet


class Extract(Action):

    def name(self):
        return 'action_extract'
    def run(self, dispatcher, tracker, domain):
        refReq = None
        vcReq = None
        if tracker.get_slot('refreshment') in ['with refreshments','with refreshment']:
            #SlotSet("refreshmentReq", True)
            refReq = True
        if tracker.get_slot('refreshment') in ['without refreshments','without refreshment']:
            #SlotSet("refreshmentReq", False)
            refReq = False
        if tracker.get_slot('vc') == 'with vc':
            #SlotSet("videoConferenceReq", True)
            vcReq = True
        if tracker.get_slot('vc') == 'without vc':
            vcReq = False
            #SlotSet("videoConferenceReq", False)
        return [SlotSet("refreshmentReq", refReq),SlotSet("videoConferenceReq", vcReq)]
        #return [SlotSet("videoConferenceReq", True)]]


class ResetSlots(Action):

    def name(self):
        return 'action_slot_reset'
    def run(self, dispatcher, tracker, domain):
        return[AllSlotsReset()]



class BookRoomForm(FormAction):

    def name(self):
        return "bookroom_form"

    @staticmethod
    def project_db()-> List[Text]:
        # type: () -> List[Text]
        """Database of current projects"""
        return ["intern",
                "java",
                "ml",
                "chatbot",
                "coding platform",
                "online medical store"
                ]

    @staticmethod
    def required_slots(tracker: Tracker) -> List[Text]:

        #return ["roomType", "startDate", "endDate","videoConferenceReq", "projectCode","refreshmentReq","additionalInfoReq","additionalInfo"]
        if tracker.get_slot('additionalInfoReq') == True:
            return ["roomType", "startDate", "endDate","videoConferenceReq", "projectCode","refreshmentReq","additionalInfoReq","additionalInfo"]
        else :
            return ["roomType", "startDate", "endDate","videoConferenceReq", "projectCode","refreshmentReq","additionalInfoReq"]

    def slot_mappings(self):
        # type: () -> Dict[Text: Union[Dict, List[Dict]]]
        """A dictionary to map required slots to
            - an extracted entity
            - intent: value pairs
            - a whole message
            or a list of them, where a first match will be picked"""

        return {
                "roomType": [self.from_entity(entity="roomType" , intent="inform_room_booking"),self.from_text(not_intent = ['affirm','deny'])],
                "startDate": self.from_entity(entity="date", intent="inform_room_booking"),
                "endDate": self.from_entity(entity="date", intent="inform_room_booking"),
                "videoConferenceReq": [self.from_intent(intent='affirm',value=True),
                            self.from_intent(intent='deny',value = False),self.from_text(not_intent = ['affirm','deny'])],
                "refreshmentReq": [self.from_intent(intent='affirm',value=True),
                            self.from_intent(intent='deny',value = False),self.from_text(not_intent = ['affirm','deny'])],
                "additionalInfoReq": [self.from_intent(intent='deny', value = False),
                            self.from_intent(intent='affirm',value=True),self.from_text(not_intent = ['affirm','deny'])],
                "additionalInfo": [self.from_text(not_intent = ['affirm','deny'])],
                "projectCode": [self.from_text(not_intent = ['affirm','deny']),self.from_entity(entity = "projectCode")]
                }



    @staticmethod
    def validate_roomType(
                         value: Text,
                         dispatcher: CollectingDispatcher,
                         tracker: Tracker,
                         domain: Dict[Text, Any]) -> Optional[Text]:
        """Validate room type"""

        if value.lower() in ['conference room', 'conference hall', 'meeting hall', 'meeting room']:
            # validation succeeded

            return {'roomType': value}
        else:
            dispatcher.utter_template('utter_wrong_roomType', tracker)
            # validation failed, set this slot to None, meaning the
            # user will be asked for the slot again
            return {'roomType': None}


    def validate_projectCode(self,
                         value: Text,
                         dispatcher: CollectingDispatcher,
                         tracker: Tracker,
                         domain: Dict[Text, Any]) -> Optional[Text]:
        """Validate project code"""

        if value.lower() in self.project_db():
            # validation succeeded
            return {'projectCode': value}
        else:
            dispatcher.utter_template('utter_wrong_projectCode', tracker)

            # validation failed, set this slot to None, meaning the
            # user will be asked for the slot again
            return {'projectCode': None}

    @staticmethod
    def validate_videoConferenceReq(value: Text,
                                 dispatcher: CollectingDispatcher,
                                 tracker: Tracker,
                                 domain: Dict[Text, Any]) -> Any:
        if value in [True, False]:
            # validation succeeded
            return {'videoConferenceReq': value}
        else:
            dispatcher.utter_template('utter_wrong_videoConferenceReq', tracker)
            # validation failed, set this slot to None, meaning the
            # user will be asked for the slot again
            return {'videoConferenceReq': None}
        return {'videoConferenceReq': value}



    @staticmethod
    def validate_refreshmentReq(value: Text,
                                 dispatcher: CollectingDispatcher,
                                 tracker: Tracker,
                                 domain: Dict[Text, Any]) -> Any:
        if value in [True, False]:
            # validation succeeded
            return {'refreshmentReq': value}
        else:
            dispatcher.utter_template('utter_wrong_refreshmentReq', tracker)

            # validation failed, set this slot to None, meaning the
            # user will be asked for the slot again
            return {'refreshmentReq': None}
        return {'refreshmentReq': value}

    @staticmethod
    def validate_additionalInfoReq(value: Text,
                                 dispatcher: CollectingDispatcher,
                                 tracker: Tracker,
                                 domain: Dict[Text, Any]) -> Any:
        if value in [True, False]:
            # validation succeeded
            return {'additionalInfoReq': value}
        else:
            dispatcher.utter_template('utter_wrong_additionalInfoReq', tracker)
            # validation failed, set this slot to None, meaning the
            # user will be asked for the slot again
            return {'additionalInfoReq': None}
        return {'additionalInfoReq': value}



    @staticmethod
    def validate_startDate(value: Text,
                                 dispatcher: CollectingDispatcher,
                                 tracker: Tracker,
                                 domain: Dict[Text, Any]) -> Any:
        return {'startDate' :value}

    @staticmethod
    def validate_endDate(value: Text,
                                 dispatcher: CollectingDispatcher,
                                 tracker: Tracker,
                                 domain: Dict[Text, Any]) -> Any:
        return {'endDate' :value}


    @staticmethod
    def additionalInfo(value: Text,
                                 dispatcher: CollectingDispatcher,
                                 tracker: Tracker,
                                 domain: Dict[Text, Any]) -> Any:
        return {'additionalInfo' :value}

    def submit(self,
               dispatcher: CollectingDispatcher,
               tracker: Tracker,
               domain: Dict[Text, Any]) -> List[Dict]:
        """Define what the form has to do
            after all required slots are filled"""

        # utter submit template
        dispatcher.utter_template("utter_submit",tracker)
        return[]
