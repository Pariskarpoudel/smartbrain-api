const handleProfileGet = (req,res,postgres)=>{
    // paxi profile lai user le update garna milni ni  banauniho, so , like username update garni, teslai post req ni handle garna parxa yo route le so , handleprofileget vaneko
    // id is a parameter req.params = {id:123}
    const {id} = req.params; 
    // we dont want to create a new list so foreach ratherthan map 
    // use select * from users, to grab the userrs 
    postgres.select('*').from('users').where({id: id})   // {id:id}   lai {id} matra lekheni hunxa as {a:a,b:b,c:c} is equivalent to {a,b,c}, selecct evverything matra garera where nalako vaye we would get all the users in an array
    // a record is represented as a json where columns are the keys
    .then((user)=>{
        if(user.length==0){
            throw Error("error bolte");
        }
        res.json(user[0])})
    // id 1000 diyeni error aaunna coz it would return an empty array which is not an error
    .catch(err=> res.json('Unable to fetch user'))
    // database.users.forEach((item)=>{
    //     if(item.id === id){
    //         found=true
    //         return res.json(item)  // return nagare ta id match vaesini chalirakhxa loop 
    //     }
    // })

}
module.exports = {
    handleProfileGet: handleProfileGet
}