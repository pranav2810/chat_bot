from flask import Flask,redirect, url_for, render_template, request, abort,session


from flask import render_template,jsonify,request
import requests
import random


#send mail libraries
from flask import Flask
from flask_mail import Mail, Message

app = Flask(__name__)
mail=Mail(app)#mail intsance


app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'karma281098@gmail.com'
app.config['MAIL_PASSWORD'] = 'Itsme123$'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)


app.secret_key = '12345'

@app.route('/')
def hello_world():
    return render_template('home.html')

get_random_response = lambda intent:random.choice(intent_response_dict[intent])

@app.route('/chat',methods=["POST"])
def chat():
    try:
        user_message = request.form["text"]

        response = requests.post("http://localhost:5005/webhooks/rest/webhook",json={"sender":"some","message":user_message})

        combined_text=""
        button_list=[]
        formatted_response_list = response.json()
        print(user_message)
        if "done" in formatted_response_list[0].get('text') :
            tempString=formatted_response_list[1].get('text')
            tempString=tempString.replace("<br>","\n")
            session['roomdetails'] = tempString

        if "send book room mail" in formatted_response_list[0].get('text'):
            if sendRoomBookingmail()=='sent':
                return jsonify({"status":"success","response":["Mail successfully sent to help desk"]})
            else:
                return jsonify({"status":"failed"})

        if "send stationery mail" in formatted_response_list[0].get('text'):
            if sendmail() == "sent":
                return jsonify({"status":"success","response":["Mail successfully sent to help desk"]})
            else:
                return jsonify({"status":"failed"})


        text_list=[]
        for each_response in formatted_response_list:

            text_list.append(each_response.get('text'))

            if "buttons" in each_response :
                for button in each_response.get('buttons'):
                    button_list.append({"title":button["title"],"payload":button["payload"]});

            if len(button_list) > 0 :
                return jsonify({"status":"success","response":text_list,"buttons":"present","button_list":button_list})


        else:
            return jsonify({"status":"success","response":text_list,"buttons":"absent"})

    except Exception as e:
        print(e)
        return jsonify({"status":"success","response":["Sorry server down.."]})



@app.route('/stationery_ui')
def stationery_ui():
    return render_template('stationery_ui.html')
    #return render_template('home.html')


@app.route('/storeCart',methods=["POST"])
def storeCart():

    try:
        session['stationery_cart'] = request.form["text"]

    except Exception as e:
        return jsonify({"status":"failed"})

    return jsonify({"status":"success"})


def sendRoomBookingmail():
    body = '''Dear team,
    Please Book me a room with following requirements.'''+ '\n' + session['roomdetails']
    try:
        msg = Message("Room Booking", sender = 'karma281098@gmail.com', recipients = ['pranav.ritvik98@gmail.com','karma281098@gmail.com','mritvik@virtusa.com'])
        msg.body = body
        mail.send(msg)
    except Exception as e:
        print(e)

    return "sent"

def sendmail():


    body = '''Dear team,
    Please provide me with the following stationery items.'''+ '\n' + session['stationery_cart']
    try:
        msg = Message("Request for stationery", sender = 'karma281098@gmail.com', recipients = ['pranav.ritvik98@gmail.com'])
        msg.body = body
        mail.send(msg)
    except Exception as e:
        print(e)

    return "sent"

#app.config["DEBUG"] = False
if __name__ == "__main__":
    app.run(host= '127.0.0.1', port=8008, debug= True)
