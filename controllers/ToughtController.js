const Tought = require("../models/Toughts");
const User = require("../models/User");

//situações como LIKE com o sequelize
const { Op } = require('sequelize')

module.exports = class ToughtsController {
  static async showToughts(req, res) {

    let search = ''

    if(req.query.search){
        search = req.query.search
    }

    let order = 'DESC'

    if(req.query.order === 'old') {
      order = 'ASC'
    }else {
      order = 'DESC'
    }

    const toughtData = await Tought.findAll({
        include: User,
        where: {
            title: {[Op.like]: `%${search}%`}
        },
        order:[['createdAt', order]]
    });

    const toughts = toughtData.map((result) => 
        result.get({
            plain: true
        })
    )

    let toughtsQty = toughts.length

    if(toughtsQty === 0){
        toughtsQty = false;
    }

    res.render("toughts/home", {toughts, search, toughtsQty});
  }

  static async dashboard(req, res) {
    const userId = req.session.userid;

    //check if user exists

    const user = await User.findOne({
      where: { id: userId },
      include: Tought,
      plain: true,
    });

    if (!user) {
      res.redirect("/login");
    }

    const toughts = user.Toughts.map((result) => result.dataValues);

    let emptyToughts = false;

    if (toughts.length === 0) {
      emptyToughts = true;
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
        res.redirect("/toughts/dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static async updateTought(req, res) {
    const userId = req.session.userid;
    const id = req.params.id;

    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      res.redirect("/login");
    }

    try {
      const tought = await Tought.findOne({
        raw: true,
        where: { id: id },
      });

      res.render("toughts/edit", { tought: tought });
    } catch (error) {
      console.log(error);
    }
  }
  static async updateToughtSave(req, res) {
    const userId = req.session.userid;
    const { id, title } = req.body;

    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      res.redirect("/login");
    }

    const tought = {
      title: title,
    };

    try {
      await Tought.update(tought, { where: { id: id } });
      req.flash("message", "Pensamento editado!!");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async removeTought(req, res) {
    const userId = req.session.userid;
    const id = req.body.id;

    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      res.redirect("/login");
    }

    try {
      await Tought.destroy({
        where: { id: id, UserId: userId },
      });
      req.flash("message", "Pensamento excluído");
      res.redirect("/toughts/dashboard");
    } catch (error) {
      console.log(error);
    }
  }
};
