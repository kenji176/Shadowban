const icons ={
    default:"fa-solid fa-circle-question text-secondary fa-xl",
    user:"fa-solid fa-circle-user text-secondary fa-xl my-2",
    load:"spinner-border text-primary mb-0",
    true:"fa-solid fa-circle-check text-success fa-xl",
    false:"fa-solid fa-circle-xmark text-danger fa-xl"
}

var app = new Vue({
    el:'#shadowban_check',
    data:{
        Header:{
            Icon:'fa-brands fa-twitter me-2',
            Title:'Shadowban Check'
        },
        Body:{
            btn:false,
            Title_Username:"Username",
            input_Username:"",
        },
        Apis:{
            check:"https://api.vxxx.cf/twitter/available?screen_name=",
            userid:"https://api.vxxx.cf/twitter/shadowban?user_id=",
            username:"https://api.vxxx.cf/twitter/shadowban?screen_name="
        },
        Result:{
            user:icons.user,
            user_info:"",
            Search_Suggestion_Ban:icons.default,
            Search_Ban:icons.default,
            Ghost_Ban:icons.default,
            Reply_Deboosting:icons.default,
        },
        Footer:{
            Authors:[
                ["@L2","https://twitter.com/L2"],
                ["@250000","https://twitter.com/250000"]
            ]
        }
    },
    methods:{
        Restore:function(){
            app.Result.user = icons.user;
            app.Result.user_info = "";
            app.Result.Search_Suggestion_Ban=icons.default;
            app.Result.Search_Ban = icons.default;
            app.Result.Ghost_Ban = icons.default;
            app.Result.Reply_Deboosting = icons.default;
        },
        Change_username:function(event){
            let format_text = event.target.value.replace(/[^0-9a-zA-Z_]{1,15}$/, "")
            if (!format_text){
                app.Body.Title_Username = "Username";
                app.Body.input_Username = ""
                event.target.value = ""
            }else{
                app.Body.Title_Username = format_text;
                app.Body.input_Username = format_text;
                event.target.value = format_text;
            }
            this.Restore()
        },
        Check_Shadow_BAN: async function(event){
            const username = await app.Body.input_Username;
            if(username.length==0){
            }else{
                app.Body.btn=true;
                for (var item in app.Result) {
                    if(item == "user"||item == "user_info"){
                        ;
                    }else{
                        app.Result[item] = icons.load
                    }
                }
                const check_res = await fetch(app.Apis.check+username);
                const check_data = await check_res.json();
                let url = ""
                if(check_data[["available"]]){
                    url = app.Apis.userid + username;
                } else {
                    url = app.Apis.username+username;
                }
                const res = await fetch(url);
                const data = await res.json();
                console.log(data);
                if(data.not_found){
                    app.Result.user = icons.false;
                    app.Result.user_info = `@${username} Not found ❓`;
                }else if(data.suspend){
                    app.Result.user = icons.false;
                    app.Result.user_info = `@${username} Suspend 🧊`
                }else if(data.protect){
                    app.Result.user = icons.false;
                    app.Result.user_info = `@${data.user.legacy.screen_name} Protect 🔒`
                }else if(data.no_tweet) {
                    app.Result.user = icons.false;
                    app.Result.user_info = `@${data.user.legacy.screen_name} No tweet 😶`
                }else if (data.error == 402){
                    app.Result.user = icons.false;
                    app.Result.user_info = `APIのレートリミットです,時間をおいて試してください`
                }else{
                    app.Result.user = icons.true;
                    app.Result.user_info = `@${data.user.legacy.screen_name} Exits`
                    if (data.no_reply){
                        app.Result.Ghost_Ban = icons.false;
                        app.Result.Reply_Deboosting = icons.false;
                    }
                    if(data.Search_Suggestion_Ban){
                        app.Result.Search_Suggestion_Ban = icons.false
                    }else{
                        app.Result.Search_Suggestion_Ban = icons.true
                    }if(data.search_ban){
                        app.Result.Search_Ban = icons.false
                    }else{
                        app.Result.Search_Ban = icons.true
                    }if(data.ghost_ban||app.Result.Ghost_Ban==icons.false){
                        app.Result.Ghost_Ban = icons.false
                    }else{
                        app.Result.Ghost_Ban = icons.true
                    }if(data.reply_deboosting || app.Result.Reply_Deboosting== icons.false){
                        app.Result.Reply_Deboosting= icons.false
                    }else[
                        app.Result.Reply_Deboosting = icons.true
                    ]
                }
            }
            app.Body.btn=false;
        }
    }
    }
)
