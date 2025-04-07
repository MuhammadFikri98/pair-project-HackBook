// const { formatRupiah, totalValuation } = require("../helpers/helper");
const { Incubator, StartUp } = require("../models");
const { Op } = require("sequelize");

class Controller {
  static async home(req, res) {
    try {
      //   console.log("masuk");
    //   let data = await Incubator.findAll({
    //     order: [["location", "ASC"]],
    //     include: {
    //       model: StartUp,
    //     },
    //   });
      // console.log(data);

      res.render("home");
    } catch (error) {
      res.send(error);
    }
  }

//   static async showAddIncubator(req, res) {
//     try {
//       let { error } = req.query;
//       let data = await Incubator.findAll();
//       //   console.log(data);

//       res.render("addIncubator", { data, error });
//     } catch (error) {
//       res.send(error);
//     }
//   }

//   static async addIncubator(req, res) {
//     try {
//       //   console.log(req.body);
//       await Incubator.create(req.body);

//       res.redirect("/");
//     } catch (error) {
//       if (error.name === "SequelizeValidationError") {
//         let msg = error.errors.map((el) => el.message);
//         res.redirect(`/incubators/add?error=${msg}`);
//       } else {
//         res.send(error);
//       }
//     }
//   }

//   static async seeDetailById(req, res) {
//     try {
//       // console.log(req.query);

//       let { incubatorId } = req.params;
//       let { notif } = req.query;
//       // console.log(incubatorId);

//       let data = await Incubator.findByPk(incubatorId, {
//         include: {
//           model: StartUp,
//           separate: true,
//           order: [["valuation", "ASC"]],
//         },
//       });

//       // notification format
//       const notification = notif
//         ? `${notif.split("-")[0]} with ${
//             notif.split("-")[1]
//           } as founder has been removed`
//         : null;

//       res.render("seeDetail", {
//         data,
//         formatRupiah,
//         totalValuation,
//         notification,
//       });
//     } catch (error) {
//       // console.log(error);

//       res.send(error);
//     }
//   }

//   static async getStartUp(req, res) {
//     try {
//       let { error } = req.query;
//       let { incubatorId } = req.params;

//       let data = await Incubator.findByPk(incubatorId);
//       // console.log(data);

//       res.render("addStartUp", { data, error });
//     } catch (error) {
//       res.send(error);
//     }
//   }

//   static async addStartUp(req, res) {
//     try {
//       let { incubatorId } = req.params;
//       let {
//         startUpName,
//         educationOfFounder,
//         founderName,
//         roleOfFounder,
//         dateFound,
//         valuation,
//       } = req.body;

//       await StartUp.create({
//         startUpName,
//         founderName,
//         dateFound,
//         educationOfFounder,
//         roleOfFounder,
//         IncubatorId: incubatorId,
//         valuation,
//       });

//       res.redirect(`/incubators/${incubatorId}`);
//     } catch (error) {
//       // console.log(error);

//       let { incubatorId } = req.params;
//       if (error.name === "SequelizeValidationError") {
//         let msg = error.errors.map((el) => el.message);
//         res.redirect(`/incubators/${incubatorId}/startUp/add?error=${msg}`);
//       } else {
//         res.send(error);
//       }
//     }
//   }

//   static async deleteStartUp(req, res) {
//     try {
//       // console.log(req.params);

//       let { incubatorId, startUpId } = req.params;

//       const startup = await StartUp.findByPk(startUpId);

//       await StartUp.destroy({
//         where: {
//           id: startUpId,
//         },
//       });

//       res.redirect(
//         `/incubators/${incubatorId}?notif=${startup.startUpName}-${startup.founderName}`
//       );
//       // res.redirect(`/incubators/${incubatorId}`);
//     } catch (error) {
//       res.send(error);
//     }
//   }

//   static async getEditStartUp(req, res) {
//     try {
//       // console.log(req.params);

//       let { error } = req.query;
//       let { incubatorId, startUpId } = req.params;

//       let data = await Incubator.findByPk(incubatorId);
//       let data2 = await StartUp.findByPk(startUpId);

//       // console.log(data2);

//       res.render("editStartUp", { data, data2, error });
//     } catch (error) {
//       res.send(error);
//     }
//   }

//   static async postEditStartUp(req, res) {
//     try {
//       // console.log(req.params);
//       // console.log(req.body);

//       let { incubatorId, startUpId } = req.params;
//       let {
//         startUpName,
//         educationOfFounder,
//         founderName,
//         roleOfFounder,
//         dateFound,
//         valuation,
//       } = req.body;

//       await StartUp.update(
//         {
//           startUpName,
//           founderName,
//           dateFound,
//           educationOfFounder,
//           roleOfFounder,
//           IncubatorId: incubatorId,
//           valuation,
//         },
//         {
//           where: {
//             id: startUpId,
//           },
//         }
//       );

//       res.redirect(`/incubators/${incubatorId}`);
//     } catch (error) {
//       // console.log(error);

//       let { incubatorId, startUpId } = req.params;
//       if (error.name === "SequelizeValidationError") {
//         let msg = error.errors.map((el) => el.message);
//         res.redirect(
//           `/incubators/${incubatorId}/startUp/${startUpId}/edit?error=${msg}`
//         );
//       } else {
//         res.send(error);
//       }
//     }
//   }

//   static async startUp(req, res) {
//     try {
//       // console.log(req.query);
//       let { role } = req.query;

//       let startup = await StartUp.findStartup(role, Op);

//       res.render("startUp", { startup, formatRupiah });
//     } catch (error) {
//       // console.log(error);

//       res.send(error);
//     }
//   }
}

module.exports = Controller;
