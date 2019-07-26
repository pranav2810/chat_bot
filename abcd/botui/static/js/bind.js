var data=[];
var globe=5;
var output="";

var general_suggestions={"book_room":"book a room",   "stationery":"request for stationery",    "ac_servive":"Air conditioner service"};
var ac_suggestions={"ac_sla":"response time"};
var room_suggestions={"room_capacity":"capacity of rooms","response_time":" response time"};

function addBr(text){
    return text.replace(/\n /g, "<br />");
}

var Message;
Message = function (arg) {
    this.text = arg.text, this.message_side = arg.message_side;
    this.draw = function (_this) {
        return function () {
            var $message;
            $message = $($('.message_template').clone().html());
            $message.addClass(_this.message_side).find('.text').html(addBr(_this.text));
          //  alert($message);
            $('.messages').append($message);
            return setTimeout(function () {
                return $message.addClass('appeared');
            }, 0);
        };
    }(this);
    return this;
};


function showBotMessage(msg){
        message = new Message({
             text: msg,
             message_side: 'left'
        });
        message.draw();
      //  alert($message);
        $messages = $('.messages');
        $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
}

function showUserMessage(msg){

        $messages = $('.messages');
        message = new Message({
            text: msg,
            //text: sessionStorage.getItem("shoppingCart"),
            message_side: 'right'
        });
        message.draw();
        $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        $('#msg_input').val('');
        $('#display').empty();
}


function sayToBot(text){

    document.getElementById("msg_input").placeholder = "Type your messages here..."
    $.post("/chat",
            {   //csrfmiddlewaretoken:csrf,
                text:text,
            },
            function(jsondata, status){

                  if(jsondata["status"]=="success"){
                          response = jsondata["response"];
                      for(var each_text in response)
                            showBotMessage(response[each_text]);
                  }

                  if(jsondata["buttons"]=="present"){
                          button_str = "";
                          button_list = jsondata["button_list"];

                          for(var i=button_list.length-1;i>=0;i--){
                             button_str ="<button class = 'suggestions' style='display: inline-block; background-color:#D2D2ED ; margin-top:5px; border-radius: 30%;  margin-left:5px; hover-color border-radius: 40%;  box-shadow: -1px 1px 1px grey; text-align: center; padding: 15px; margin-right:5px;' type = 'button' value = '"+button_list[i].title +"' onclick = 'clicked(this)' > "+button_list[i].title  + "</button>";
                             $('#display').append(button_str);
                          }
                  }
                });

}//say to bot end

getMessageText = function () {

            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();

};


function clicked (e) {

  showUserMessage(e.value);
  sayToBot(e.value);

}

function displayButtons(category){

  $('#display').empty();

  if(category=="general_suggestions"){

  for(var key in general_suggestions){

     button_str ="<button class = 'suggestions' style='display: inline-block; background-color:#D2D2ED ; margin-top:5px; margin-left:5px; border-radius: 30%; hover-color border-radius: 40%;  box-shadow: -1px 1px 1px grey; text-align: center; padding: 15px; margin-right:5px;' type = 'button' value = '"+general_suggestions[key] +"' onclick = 'clicked(this)' > "+ general_suggestions[key] + "</button>";
     $('#display').append(button_str);
  }
}

}


$("#say").keypress(function(e){

    if(e.which == 13){
        $("#saybtn").click();
    }

});

$(window).load(function(){


    if(sessionStorage.getItem('cart')=='full'){

        list = JSON.parse(sessionStorage.getItem("shoppingCart"));
        //output="";
        for(var i=0;i<list.length;i++){
          output+= list[i]['name']+" ( "+list[i]['count']+" )\n ";
        }
        sessionStorage.setItem('cart','empty');

        showBotMessage(output);
        //showBotMessage("Do you want to send the mail ?");
        $.post("/storeCart",
                {   //csrfmiddlewaretoken:csrf,
                    text:output,
                },
                function(jsondata, status){

                      if(jsondata["status"]=="success"){
                            showBotMessage("Do you want to send the mail ?");
                      }

                      else showBotMessage("Something went wrong");
        });
        //  showBotMessage("Do you want to send the mail ?");
        //showBotMessage("<button class = 'suggestions' style='display: inline-block; background-color:#D2D2ED ; margin-top:5px; margin-left:5px; hover-color border-radius: 40%;  box-shadow: -1px 1px 1px grey; text-align: center; padding: 15px; margin-right:5px;' type = 'button' value = '"+response time +"' onclick = 'clicked(this)' > "+ response time + "</button>";)
    }
    else {

        displayButtons("general_suggestions");
        var welcome="Hey! i'm usher.<br>I can help you with<br>1- Room bookings for meeting<br>2- AC temperature adjustments<br>3- Stationery"
        showBotMessage(welcome);

    }
});

$('.send_message').click(function (e) {
        msg = getMessageText();
        if(msg){
        showUserMessage(msg);
        sayToBot(msg);
    $('.message_input').val('');}
});

$('.message_input').keyup(function (e) {
    if (e.which === 13) {
        msg = getMessageText();
        if(msg){
        showUserMessage(msg);
        sayToBot(msg);
    $('.message_input').val('') ;}
    }
});
