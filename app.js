const express = require('express')
const bodyParser = require('body-parser')
const mailchimp = require("@mailchimp/mailchimp_marketing")

//init app and port
const port = process.env.PORT || 3000
const app = express()


//setting up statics
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'))


//mailchimp ping test
mailchimp.setConfig({
  apiKey: "d3ff3a4e77b3686e74b5e6af6e62aba3-us7",
  server: "us7",
})

const mailchimpPingTest = async () => {
  const response = await mailchimp.lists.getAllLists();
  console.log(response);
}


//On App launch
app.get('/', (req, res) => {
    mailchimpPingTest();
    res.sendFile(__dirname + '/public/signup.html')
})

app.post('/', (req, res)=>{
    const {fName, lName, email} = req.body
    const listId = '1050abf450'
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }                
            }
        ]
    }
    //mailchimp update list
    const updateList = async ()=>{
        const response = await mailchimp.lists.batchListMembers(listId, data)
        if(response.errors.length === 0){
            res.sendFile(__dirname + '/public/success.html')
        }else{
            res.send(response.errors)
        }
    }

    updateList()
})







app.listen(port, ()=>{
    console.log("Server started at port " + port)
})

//d3ff3a4e77b3686e74b5e6af6e62aba3-us7
// /lists/{list_id}/members