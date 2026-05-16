using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using TricycleSystem.Models;
using TricycleSystem.Models.Context;
using TricycleSystem.Models.Tables;

namespace POSSystem.Controllers
{
    public class POSController : Controller
    {
        // ==========================================
        // VIEW ACTIONS (Routing to your HTML Pages)
        // ==========================================
        public ActionResult LoginPage() { return View(); }
        public ActionResult AdminPage() { return View(); }
        public ActionResult RegistrationPage() { return View(); }
        public ActionResult DashBoard() { return View(); }
        public ActionResult UserPage() { return View(); }
        public ActionResult HomePage() { return View(); }

        // ==========================================
        // AUTHENTICATION
        // ==========================================
        [HttpPost]
        public JsonResult Login(tbl_user_model credentials)
        {
            try
            {
                using (var connect = new TricycleContext())
                {
                    var admin = connect.tbl_admin.FirstOrDefault(a =>
                        a.user_name == credentials.user_name &&
                        a.password == credentials.password);

                    if (admin != null)
                    {
                        return Json(new
                        {
                            success = true,
                            role = "Admin",
                            user = admin.user_name
                        });
                    }

                    var user = connect.tbl_user.FirstOrDefault(u =>
                                u.user_name == credentials.user_name &&
                                u.password == credentials.password);

                    if (user != null)
                    {
                        return Json(new
                        {
                            success = true,
                            role = "User",
                            user = user.full_name,
                            userId = user.user_id
                        });
                    }

                    return Json(new { success = false, message = "Invalid Username or Password" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Database Error: " + ex.Message });
            }
        }

        // ==========================================
        // USER MANAGEMENT (Registration)
        // ==========================================

        public string UpsertUser(tbl_user_model newUser)
        {
            try
            {
                using (var connect = new TricycleContext())
                {
                    var existing = connect.tbl_user.FirstOrDefault(u => u.user_name == newUser.user_name);
                    if (existing != null) return "Username already taken.";

                    connect.tbl_user.Add(newUser);
                    connect.SaveChanges();

                    var newAccount = new tbl_useraccounts_model()
                    {
                        user_id = newUser.user_id,
                        full_name = newUser.full_name,
                        status = "Pending",
                        total_price = 0,
                        monthly_rate = 0,
                        balance = 0,
                        due_date = DateTime.Now.AddMonths(1)
                    };

                    connect.tbl_useraccounts.Add(newAccount);
                    connect.SaveChanges();

                    return "Success";
                }
            }
            catch (Exception ex)
            {
                return "Database Error: " + GetDeepestException(ex);
            }
        }

        // ==========================================
        // ACCOUNT DATA (Dashboard & Analytics)
        // ==========================================
        [HttpGet]
        public JsonResult GetAccounts()
        {
            try
            {
                using (var connect = new TricycleContext())
                {
                    var list = connect.tbl_useraccounts.ToList();
                    return Json(list, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { error = GetDeepestException(ex) }, JsonRequestBehavior.AllowGet);
            }
        }

        // ==========================================
        // ADMIN ACTIONS (Activation & Payments)
        // ==========================================

        [HttpPost]
        public string ActivateUserPlan(tbl_useraccounts_model planDetails)
        {
            try
            {
                using (var connect = new TricycleContext())
                {
                    var existingAccount = connect.tbl_useraccounts
                        .FirstOrDefault(u => u.user_id == planDetails.user_id);

                    if (existingAccount != null)
                    {
                        existingAccount.status = "Active";
                        existingAccount.total_price = planDetails.total_price;
                        existingAccount.monthly_rate = planDetails.monthly_rate;
                        existingAccount.balance = planDetails.total_price;
                        existingAccount.due_date = planDetails.due_date;
                    }
                    else
                    {
                        planDetails.status = "Active";
                        planDetails.balance = planDetails.total_price;
                        connect.tbl_useraccounts.Add(planDetails);
                    }

                    connect.SaveChanges();
                    return "Success";
                }
            }
            catch (Exception ex)
            {
                return "Error: " + GetDeepestException(ex);
            }
        }

        [HttpPost]
        public JsonResult UpdateUserPayment(int user_id, decimal amountPaid, DateTime nextDueDate)
        {
            try
            {
                using (var connect = new TricycleContext())
                {
                    var account = connect.tbl_useraccounts.FirstOrDefault(u => u.user_id == user_id);
                    if (account != null)
                    {
                        account.balance -= (float)amountPaid;

                        account.due_date = nextDueDate;

                        connect.SaveChanges();
                        return Json(new { success = true });
                    }
                    return Json(new { success = false, message = "Account not found" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = GetDeepestException(ex) });
            }
        }
        public JsonResult GetBusinessStatus()
        {
            using (var connect = new TricycleContext())
            {
                var users = connect.tbl_useraccounts.ToList();

                var cardStatusData = new List<StatusCardModel>
        {
            new StatusCardModel { StatusDesc = "Active Buyers", StatusCount = users.Count(x => x.status == "Active") },
            new StatusCardModel { StatusDesc = "Total Sales Value", StatusCount = (decimal)users.Sum(x => x.total_price) },
            new StatusCardModel { StatusDesc = "Outstanding Balance", StatusCount = (decimal)users.Sum(x => x.balance) }
        };

                // 2. PIE & DONUT CHART DATA (Account Distribution)
                var pieLabels = new[] { "Active", "Pending", "Inactive" };
                var pieData = new[] {
            users.Count(x => x.status == "Active"),
            users.Count(x => x.status == "Pending"),
            users.Count(x => x.status == "Inactive")
        };

                // 3. LINE CHART DATA (Sales Trends)
                var monthlySales = users
                    .Where(x => x.due_date.Year == DateTime.Now.Year)
                    .GroupBy(x => x.due_date.Month)
                    .Select(g => new { Month = g.Key, Total = g.Sum(x => x.total_price) })
                    .OrderBy(x => x.Month)
                    .ToList();

                var lineLabels = new List<string>();
                var lineData = new List<double>();

                foreach (var month in monthlySales)
                {
                    lineLabels.Add(System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(month.Month));
                    lineData.Add(month.Total);
                }

                return Json(new
                {
                    cards = cardStatusData,
                    pieChart = new { labels = pieLabels, data = pieData },
                    lineChart = new { labels = lineLabels, data = lineData }
                }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetUserFinancialStatus(int userId)
        {
            using (var connect = new TricycleContext())
            {
                var account = connect.tbl_useraccounts.FirstOrDefault(x => x.user_id == userId);

                if (account == null) return Json(new { success = false }, JsonRequestBehavior.AllowGet);

                // Donut Graph Logic
                float totalContract = account.total_price;
                float remainingBalance = account.balance;
                float totalPaid = totalContract - remainingBalance;

                // Line Graph Logic
                var financialData = new
                {
                    donutLabels = new[] { "Total Paid", "Remaining Balance" },
                    donutData = new[] { totalPaid, remainingBalance },
                    lineLabels = new[] { "Jan", "Feb", "Mar", "Apr" },
                    lineData = new[] { account.monthly_rate, account.monthly_rate, account.monthly_rate, account.monthly_rate },
                    isActivated = account.total_price > 0 && account.status == "Active"
                };

                return Json(financialData, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetUserSpecificAccount(int userId)
        {
            try
            {
                using (var connect = new TricycleContext())
                {
                    var userAccount = connect.tbl_useraccounts
                                             .FirstOrDefault(u => u.user_id == userId);

                    return Json(userAccount, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { error = GetDeepestException(ex) }, JsonRequestBehavior.AllowGet);
            }
        }

        // ==========================================
        // UTILS
        // ==========================================
        private string GetDeepestException(Exception ex)
        {
            Exception inner = ex;
            while (inner.InnerException != null) inner = inner.InnerException;
            return inner.Message;
        }
    }
}