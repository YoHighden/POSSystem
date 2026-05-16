app.service("POSSystemService", function ($http) {

    // =========================
    // USER MANAGEMENT
    // =========================
    this.UpsertUserData = function (newUser) {
        return $http({
            method: "post",
            url: "/POS/UpsertUser",
            data: newUser
        });
    };

    this.GetUserData = function () {
        return $http({
            method: "get",
            url: "/POS/GetAccounts"
        });
    };

    // =========================
    // AUTHENTICATION
    // =========================
    this.LoginUser = function (credentials) {
        return $http({
            method: "post",
            url: "/POS/Login",
            data: credentials
        });
    };

    // =========================
    // ADMIN ACTIONS
    // =========================
    this.ActivateUserPlan = function (activationData) {
        return $http({
            method: "post",
            url: "/POS/ActivateUserPlan",
            data: activationData
        });
    };

    this.UpdateUserPayment = function (paymentData) {
        return $http({
            method: "post",
            url: "/POS/UpdateUserPayment",
            data: paymentData
        });
    };

    this.GetUserStatusService = function () {
        return $http.get("/POS/GetBusinessStatus");
    };

    this.GetUserFinancialService = function (userId) {
        return $http.get("/POS/GetUserFinancialStatus?userId=" + userId);
    };

    this.GetUserAccountStatusService = function () {
        return $http.get("/POS/GetAccounts");
    };

    this.GetLoggedInUserAccount = function (userId) {
        return $http({
            method: "get",
            url: "/POS/GetUserSpecificAccount",
            params: { userId: userId }
        });
    };
});