// const {Router}=require("express")
//const routes=Router()
const { SignUp, Login, Logout, Offer, Delete, ShowAllOffer } = require("../controller/logic")
//const { requireAuth } =require("../middleware/authentication")

const { requireAuth } = require("../middleware/authentication ")

const full_details = require("../models/offer_schema")

const Players = require("../models/player_schema")

const Routes = require("express").Router();

//Routes.post("/SignUp").get(SignUp);

Routes.post("/signup", SignUp);

Routes.post("/login", Login);

Routes.get("/logout", Logout)

Routes.post("/offer", Offer)

Routes.post("/editoffer", requireAuth, async (req, res) => {

    let sele_obj = {};
    const data = req.body;
    console.log("from_editoffer", data);
    for (let prop in data) {
        console.log(`${prop}: ${data[prop]}`);
        if (data[prop]) {
            sele_obj[prop] = data[prop];
        }
    }
    console.log(sele_obj);
    try {
        for (let prop in sele_obj) {

            console.log(prop,sele_obj[prop])
            if (/*prop == "id" && sele_obj[prop] !== '' ||*/
                prop == "offer_id" && sele_obj[prop] !== '' ||
                prop == "offer_title" && sele_obj[prop] !== '' ||
                prop == "offer_description" && sele_obj[prop] !== '' ||
                prop == "offer_image" && sele_obj[prop] !== '' ||
                prop == "offer_sort_order" && sele_obj[prop] !== '') 
            {
                console.log("inside if")
                const update = await full_details.
                updateOne({ _id: sele_obj.id }, { $set: { [`Offers.${prop}`]: sele_obj[prop] } }).
                then(data=>console.log(data)).catch(error=>console.log(error))
            }
            else if (prop == "currency" && sele_obj[prop] !== '' ||
                prop == "cost" && sele_obj[prop] !== '') {
                console.log("pricing",`Offers.pricing[0].${prop}`)
                const updatevalue = await full_details.
                updateOne({ _id: sele_obj.id }, 
                    { $set: { [`Offers.pricing.$[].${prop}`]: Number(sele_obj[prop]) } }).then(data=>console.log(data)).
                    catch(error=>console.log(error))
            }

            else if (prop == "age" && sele_obj[prop] !== '' ||
                prop == "installed_days" && sele_obj[prop] !== '') {
                console.log("target")
                const updatevalue = await full_details.
                updateOne({ _id: sele_obj.id }, 
                    { $set: { [`Offers.target.$[].${prop}`]: sele_obj[prop] } }).then(data=>console.log(data)).
                    catch(error=>console.log(error))
            }

            else if (prop == "item_id" && sele_obj[prop] !== '' ||
                prop == "quantity" && sele_obj[prop] !== '') {
                console.log("content")
                const updatevalue = await full_details.
                updateOne({ _id: sele_obj.id }, 
                    { $set: { [`Offers.content.$[].${prop}`] : sele_obj[prop] } }
                    // { arrayFilters: [{ "elem.item_id": sele_obj[prop] }] }
                    // { $set: { [`Offers.content.$[elem].${prop}`]: sele_obj[prop] } },
                    // { arrayFilters: [{ [`elem.${prop}`] : sele_obj.prop }] }
                    /*{ $set: { [`Offers.content${[0]}.${prop}`]: sele_obj[prop] } }*/ ).then(data=>console.log(data)).
                    catch(error=>console.log(error))
            }

            else if (prop == "days_of_week" && sele_obj[prop] !== '' ||
                prop == "dates_of_month" && sele_obj[prop] !== '' ||
                prop == "months_of_year" && sele_obj[prop] !== '') {
                console.log("schedule")
                const updatevalue = await full_details.
                updateOne({ _id: sele_obj.id }, { $set: { [`Offers.schedule.${prop}`]: sele_obj[prop] } })
            }

        }
        res.status(200).send({message:"updated sucessfully"})
    }
    catch (error) {
        res.status(500).send(error)
    }

});

Routes.post("/delete", requireAuth, async (req, res) => {

    const { id } = req.body
    console.log("id", id);

    try {
        const offerdeleted = await full_details.deleteOne({ "_id": id })
        console.log("offerdeleted", offerdeleted);

        res.status(204).send({message:"deleted sucessfully"})
    }
    catch (error) {
        res.status(500).send(error);
    }

});

Routes.get("/showalloffer", requireAuth, async (req, res) => {


    try {
        const data = await full_details.find({})
        console.log("data from showalloffer", data)
        res.status(200).send(data);

    }
    catch (error) {

        res.status(500).send(error)

    }
})

Routes.get("/offers", requireAuth, async (req, res) => {

    console.log("req.session", req.session.userId);


    let player_id = req.session.userId;
    console.log(player_id)

    try {
        const data = await Players.
            find({ 'Player.player_id': player_id },
                { 'Player.age': 1, 'Player.installed_days': 1 })
        console.log(data[0])
        const { age, installed_days } = data[0].Player
        console.log(age, installed_days)

        const eligibleforoffer = await full_details.
            find({}, { 'Offers.target': 1 })

        let array = [];

        console.log("eligibleforoffer", eligibleforoffer);
        console.log(eligibleforoffer.length)

        for (let i = 0; i < eligibleforoffer.length; i++) {

            // console.log(eligibleforoffer[i].Offers.target[0].age)
            // console.log(eligibleforoffer[i].Offers.target[0].installed_days)
            let x = eligibleforoffer[i].Offers.target[0].age;
            let y = eligibleforoffer[i].Offers.target[0].installed_days;

            console.log("xy", parseInt(x), parseInt(y), age, installed_days, i);

            if (age > parseInt(x) && installed_days <= parseInt(y)) {
                // let id = eligibleforoffer[i]._id
                console.log(eligibleforoffer[i]._id)
                const gift = await full_details.findOne({ "_id": eligibleforoffer[i]._id });
                console.log("gift", gift);
                array.push(gift)
                // res.status(200).json({ value:gift })
            }
            else {
                res.status(201).json({ id: null })
            }
        }

        console.log(array);
        res.status(200).json({ value: array })

    }
    catch (error) {

        if (error) {
            res.status(400).send(error)
        }
    }
})

module.exports = Routes;   