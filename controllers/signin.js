const handleSignin = (req,res,postgres,bcrypt)=>{  // signin garda we send the user record as json from users table to frontend, frontend catches the response and use it to display the appropriate thing, frontend  ma fetch() use garera server/backend ma request pathauxam, always to make a get,post request to server, use fetch
    // post req ma body ma json data pathauniho formdata haina  {"email": "...", password: "..."}, json pathauni ho , so json pathauda bodyparser jasto use to parse json 
    // Load hash from your password DB.
//     bcrypt.compare("paridon123", '$2a$10$KHhycyPzxyTG/ak7Hxz6veLlkSNQ1OySKo0qHx5u3jjUBbCu/PzaW', function(err, res) {
//     // res == true
//     console.log(res)
// });
    const {name,email,password} = req.body;
   if(!email || !password){
    // it is better to do form validation in backend
    return res.status(400).json("Incorrect form submission")
    // return nagare ta talako code ni chalxa for empty user, so return to get out of the function
}
    postgres.select('email','hash').from('login')
    .where({email: email})
    // junjun rows select vaye, tni array ma auxa, each row is represented as json
    .then(data=>{
        // this doesnt need to be a transaction, coz we are just checking, not modifying the database items
        const isValid = bcrypt.compareSync(password, data[0].hash)
        if(isValid){
            postgres.select('*').from('users')
            .where({email: email})
            .then(user=>{
                res.json(user[0])
            })
            .catch(err=> res.status(400).json('Unable to get user'))
        }
        else{
            res.status(400).json("wrong credentials")
        }
    })
    .catch(err=>res.status(400).json('wrong credentials'))
// register garda login table ma pani  email ra password insert hos , coz signin garda login table bata data compare garinxa
// when we are doing multiple database operations on a database ,it is recommended to enclose it in a transaction, to make things consistent 
// select use garda chai  we are just checking and returning the asked columns, we are not modifying the records, so duitai table ma operation gare  ni transacction ma wrap garna pardena, yedi database modify gareko vaye chai transaciton ma wrap garna parthyo
// so that if one fails, all fails eg: if for some reason users table ma insert vayo tara login ma vaena, it would be inconsistent, we would want ki duitaima hos, autama ni fail vaepar duitai ma nahos baru , pre transaction state ma jaos so that inconsistencies are avoided
// let paila login ma insert garam, tyo successfull vaepar balla usersmaa, if users fail vaepar, tyo login ma insert vako ni rollback vaera pre transaction state ma janxa

}
module.exports = {handleSignin: handleSignin}