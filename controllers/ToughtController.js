const Tought = require("../models/Toughts");
const User = require("../models/User");

module.exports = class ToughtsController {
  static async showToughts(req, res) {
    res.render("toughts/home");
  }
  static async dashboard(req, res) {
    const userId = req.session.userid;

    //check if user exists

    const user = await User.findOne({
        where: {id: userId},
        include: Tought,
        plain: true
    })

    if(!user){
        res.redirect('/login')
    }

    const toughts = user.Toughts.map((result) => result.dataValues)

    let emptyToughts = false

    if(toughts.length === 0 ){
        emptyToughts = true
    }

    res.render("toughts/dashboard", { toughts: toughts, emptyToughts });
  }

  static createTought(req, res) {
    res.render("toughts/create");
  }

  static async createToughtSave(req, res) {
    const UserId = req.session.userid;
    const { title } = req.body;

    const toughtData = {
      title,
      UserId,
    };
    await Tought.create(toughtData)
      .then((tought) => {
        // console.log(tought);
        res.render("toughts/dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
