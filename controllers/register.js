const handleRegister = (req,res,postgres,bcrypt)=> {
    // currently registered user pathauna paryo responseko roopma
    // datako roopma email password ra name aauxa server ma 
    const {name, email, password} = req.body;
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     // Store hash in your password DB.
    //     console.log(hash)
    // });

    if(!name || !email || !password){
        // it is better to do form validation in backend
        return res.status(400).json("Incorrect form submission")
        // return nagare ta talako code ni chalxa for empty user, so return to get out of the function
    }

   const hash = bcrypt.hashSync(password)
   postgres.transaction((trx) => {
    return trx
            .insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then((loginEmail)=>{
            return trx 
                .insert({
                    email: loginEmail[0].email,  // yeha sidai email matra lekheni hunthyo but we are making them connected
                    name: name,
                    joined: new Date()
                })
                .into('users')
                .returning('*')
                .then((user)=>{res.json(user[0])})
    })
    .then(trx.commit)
    .catch(trx.rollback)
   })
// the returning method specifies which columns should be returned by the insert as response/resolved value, update and delete methods , as db.insert() is a promise
// returning('id') , returns column id, returning(['id','name']) returns id and name column as response/resolve of the promise
// record means row, vakkharai jun record insert gare, tei record matra return garna milxa, tei record matra return hunxa , duita record ekaichati insert gare vani, duita records haruko id return hunivayo
// returning('*'), means returning all columns of the inserted user/users

// resolve contain all columns *  of the inserted user, so it returns all columns of the inserted user, so currently registered user return garnivayo jun uta response ko roopma pathainxa frontendma
// .then(console.log) returns the response, is same like .then((response)=>{console.log(response)}), here response is the user object
// response ko roopma bhakkarai add vako user jo send garam hai ta 
// res.json(database.users[database.users.length - 1])  // returns the last or latest or bhakkharai register vako user as response
    .catch(err=>res.status(400).json('Unable to register!'))
}



module.exports = {handleRegister: handleRegister}