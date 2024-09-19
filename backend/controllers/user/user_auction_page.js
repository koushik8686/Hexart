const usermodel =  require("../../models/usermodel")
const {itemmodel} =  require("../../models/itemmodel")

async function render_auctionpage(req, res) { 
    var name = " "
    await usermodel.findOne({_id:req.params.userid}).then((result)=>{
     name=result.email
    }) 
    itemmodel.findOne({_id:req.params.itemid}).then( async (result)=>{
      if (!result) {
        res.send('<h1>Item Sold</h1><br><a href="/user/' + req.params.userid + '">Back to User Profile</a>');
        return
      }
      if (result.aution_over) {
        res.send("item sold")
        res.redirect("/user/"+req.params.userid)
      }
      if (result.pid==req.params.userid) {
       res.redirect("/"+req.params.userid+"/auction/item/"+req.params.itemid+"/owner")
        return
      }       
      const isVisited = result.visited_users.some(user => user.id === req.params.userid);
      // If the user is not in the visited_users array, add them
      if (!isVisited) {
          result.visited_users.push({ id: req.params.userid, email: name });
          await result.save();
      }

     var data = {
      user: req.params.userid,
      username:name,
      item:result
     }
      res.status(200).send({data:data} )
     })
   }

 async function bid (req, res) { 
  console.log(req.body);
    var price=0
     price =Number(req.body.bid)
    var name = " "
    usermodel.findOne({_id:req.params.userid}).then((result)=>{
      name=result.username
    })
    itemmodel.findOne({_id:req.params.itemid}).then((result)=>{
      if (!result) {
        res.send("item sold")
        return
      }
    if (price<result.current_price||price<result.base_price) {
      res.redirect("/auction/"+req.params.userid+"/item/"+req.params.itemid)
    }else{
      itemmodel.findOne({_id:req.params.itemid}).then((result)=>{
        result.current_price=price
        result.current_bidder=name
        result.current_bidder_id=req.params.userid
        result.auction_history.push({ bidder: name, price: price.toString() });
         result.save();
        res.status(200).send({message:"success" , item:result} )
        })
    }
      })
    }
   

module.exports = {render_auctionpage , bid }