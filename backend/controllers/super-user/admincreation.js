const adminmodel = require("../../models/adminmodel");
const path = require("path")
function admincreate_get (req, res) {
  res.sendFile(path.join(__dirname, "../../views/admincreate.html"));
}
function admincreate_post  (req, res){
    var email = req.body.email
    var pass = req.body.pass
    console.log(req.body);
    const a = new adminmodel ({
        email:email,
        password:pass,
        permissions:{
          viewing:true,
          users_editing:true,
          items_editing:true,
          seller_editing:true
      }
          })
    a.save()
   res.status(200).send({message:"success"})
  }

module.exports= {admincreate_get, admincreate_post}