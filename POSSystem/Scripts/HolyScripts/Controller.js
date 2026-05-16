console.log("FILE CHECK: Controller.js is running successfully.");

app.controller("POSSystemController", function ($scope, $http, $window, $timeout, POSSystemService) {

    // =========================
    // GLOBAL DATA
    // =========================
    $scope.userArray = [];
    $scope.usersInfo = [];
    $scope.searchText = "";
    $scope.selectedUser = {};
    $scope.renderCharts = function () {
        // 1. Line Chart Data (Collection Progress)
        $scope.paymentLabels = ["Total Sales", "Paid", "Outstanding"];
        $scope.paymentSeries = ['Financial Status'];

        var totalSales = $scope.calculateTotalSales();
        var outstanding = $scope.calculateTotalPending();
        var paid = totalSales - outstanding;

        $scope.paymentData = [
            [totalSales, paid, outstanding]
        ];
        $scope.lineColors = ['#1a237e'];

        // 2. Doughnut/Pie Chart Data (Account Status)
        var activeCount = $scope.userArray.filter(u => u.status === 'Active').length;
        var pendingCount = $scope.userArray.length - activeCount;

        $scope.statusLabels = ["Active Accounts", "Pending Approval"];
        $scope.statusData = [activeCount, pendingCount];
        $scope.statusColors = ['#1a237e', '#fdd835']; // Blue and Yellow accents

        // 3. Options
        $scope.lineOptions = {
            responsive: true,
            scales: { yAxes: [{ ticks: { beginAtZero: true } }] }
        };

        $scope.pieOptions = {
            legend: { display: true, position: 'bottom' }
        };
    };
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    $scope.options = {
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                },
                {
                    id: 'y-axis-2',
                    type: 'linear',
                    display: true,
                    position: 'right'
                }
            ]
        }
    };
    // =========================
    // INIT FUNCTIONS
    // =========================
    $scope.initDashboard = function () {
        console.log("Dashboard initialized");
        $scope.loadAccounts();
    };

    $scope.initAdmin = function () {
        console.log("Admin page initialized");
        $scope.loadAccounts();
    };

    $scope.initUserPage = function () {
    // 1. Get the ID we saved at login
    var userId = sessionStorage.getItem('loggedUserId');

    if (userId) {
        // 2. Fetch raw account details for the text cards
        POSSystemService.GetUserFinancialService(userId).then(function (response) {
            var res = response.data;
            
            // 3. Set your chart variables using this user's specific data
            $scope.userDonutData = res.donutData; 
            $scope.userLineData = [res.lineData]; 
            $scope.userDonutLabels = res.donutLabels;
            $scope.userLineLabels = res.lineLabels;

            $http.get("/POS/GetUserSpecificAccount?userId=" + userId).then(function(accResponse) {
                $scope.userArray = [accResponse.data];
            });
        });
    } else {
        window.location.href = "/POS/LoginPage";
    }
    };

    $scope.loadUserCharts = function (userId) {
        POSSystemService.GetUserFinancialService(userId).then(function (response) {
            var data = response.data;

            // 1. Line Graph: Monthly Payments
            $scope.userLineLabels = data.lineLabels;
            $scope.userLineData = [data.lineData];
            $scope.userLineSeries = ['Amount Paid'];

            // 2. Donut Graph: Total Paid vs Balance
            $scope.userDonutLabels = data.donutLabels;
            $scope.userDonutData = data.donutData;

            $scope.userDonutColors = ['#4CAF50', '#F44336'];
        });
    };

    // =========================
    // LOGIN 
    // =========================
    $scope.loginUser = function () {
        var loginCredentials = {
            "user_name": $scope.loginUserName,
            "password": $scope.loginPassword
        };

        POSSystemService.LoginUser(loginCredentials).then(function (response) {
            if (response.data.success) {
                M.toast({ html: 'Signed in as ' + response.data.role, classes: 'green' });

                if (response.data.role === "Admin") {
                    window.location.href = "/POS/Dashboard";
                } else {
                    // Store the ID before redirecting
                    sessionStorage.setItem('loggedUserId', response.data.userId);
                    window.location.href = "/POS/Userpage";
                }
            } else {
                M.toast({ html: response.data.message, classes: 'red' });
            }
        });
    };

    $scope.clearLoginFunc = function () {
        $scope.loginUserName = "";
        $scope.loginPassword = "";
        M.updateTextFields();
    };

    $scope.logout = function () {
        if (confirm("Are you sure you want to logout?")) {
            sessionStorage.clear();
            $window.location.href = "/POS/LoginPage";
        }
    };   

    // =========================
    // REGISTER & DATA LOADING
    // =========================
    $scope.saveUser = function () {
        var newUser = {
            "full_name": $scope.full_name,
            "age": $scope.age,
            "email": $scope.email,
            "address": $scope.address,
            "user_name": $scope.user_name,
            "password": $scope.password
        };

        var upsertData = POSSystemService.UpsertUserData(newUser);
        upsertData.then(function (returnedData) {
            alert(returnedData.data);
            $scope.loadAccounts();
        });
    };

    $scope.loadAccounts = function () {
        var getData = POSSystemService.GetUserData();

        getData.then(function (returnedData) {
            $scope.userArray = returnedData.data;
            $scope.usersInfo = returnedData.data;
            console.log("Data loaded successfully:", $scope.userArray.length, "users found.");

            $scope.renderCharts();
        }).catch(function (error) {
            console.error("Error loading accounts:", error);
        });
    };

    // =========================
    // CALCULATIONS
    // =========================
    $scope.calculateTotal = function () {
        return $scope.userArray.reduce((sum, u) => sum + (parseFloat(u.balance) || 0), 0);
    };

    $scope.calculateTotalSales = function () {
        return $scope.userArray.reduce((sum, u) => sum + (parseFloat(u.total_price) || 0), 0);
    };

    $scope.calculateMonthlyPending = function () {
        let totalMonthly = 0;
        if ($scope.userArray && $scope.userArray.length > 0) {
            $scope.userArray.forEach(function (user) {
                if (user.status === 'Active' && user.monthly_rate) {
                    let rate = parseFloat(user.monthly_rate);
                    if (!isNaN(rate)) {
                        totalMonthly += rate;
                    }
                }
            });
        }
        return totalMonthly;
    };

    // =========================
    // ADMIN ACTIONS (MODALS)
    // =========================
    $scope.activatePlan = function (user) {
        $scope.selectedUser = user;
        $scope.pricing = { total: 0, rate: 0, dueDate: "" };

        var elem = document.getElementById('modalSetPrice');
        var instance = M.Modal.getInstance(elem);
        if (!instance) instance = M.Modal.init(elem);

        instance.open();

        $timeout(function () {
            M.updateTextFields();
        }, 150);
    };

    $scope.confirmActivation = function () {
        if (!$scope.pricing.total || !$scope.pricing.rate || !$scope.pricing.dueDate) {
            M.toast({ html: 'Please fill in all fields', classes: 'red' });
            return;
        }

        var activationData = {
            "user_id": $scope.selectedUser.user_id,
            "full_name": $scope.selectedUser.full_name,
            "total_price": parseFloat($scope.pricing.total),
            "monthly_rate": parseFloat($scope.pricing.rate),
            "due_date": $scope.pricing.dueDate
        };

        POSSystemService.ActivateUserPlan(activationData).then(function (response) {
            if (response.data === "Success") {
                M.Modal.getInstance(document.getElementById('modalSetPrice')).close();
                M.toast({ html: 'Plan Activated for ' + activationData.full_name, classes: 'green' });
                $scope.loadAccounts();
            } else {
                alert(response.data);
            }
        });
    };

    $scope.processPayment = function (user) {
        $scope.selectedUser = user;

        var nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        $scope.payment = {
            amount: parseFloat(user.monthly_rate),
            nextDue: nextMonth.toISOString().split('T')[0]
        };

        var elem = document.getElementById('modalPayment');
        var instance = M.Modal.getInstance(elem);
        if (!instance) instance = M.Modal.init(elem);

        instance.open();

        $timeout(function () {
            M.updateTextFields();
        }, 150);
    };

    $scope.confirmPayment = function () {
        if (!$scope.payment.amount || !$scope.payment.nextDue) {
            M.toast({ html: 'Please enter amount and date', classes: 'red' });
            return;
        }

        var paymentData = {
            "user_id": $scope.selectedUser.user_id,
            "amountPaid": parseFloat($scope.payment.amount),
            "nextDueDate": $scope.payment.nextDue
        };

        $http.post('/POS/UpdateUserPayment', paymentData)
            .then(function (response) {
                if (response.data === "Success" || response.data.success) {
                    M.Modal.getInstance(document.getElementById('modalPayment')).close();
                    M.toast({ html: 'Payment Updated Successfully', classes: 'green' });
                    $scope.loadAccounts();
                } else {
                    alert(response.data.message || 'Update failed');
                }
            })
            .catch(function (error) {
                console.error("Payment Error:", error);
                M.toast({ html: 'Server error.', classes: 'red' });
            });
    };

    // =========================
    // CHARTS
    // =========================
    $scope.getBusinessDashboard = function () {
        POSSystemService.GetUserStatusService().then(function (response) {
            var res = response.data;

            // Map Stat Cards
            $scope.cardData = res.cards;

            // Map Line Chart
            $scope.lineLabels = res.lineChart.labels;
            $scope.lineData = [res.lineChart.data];

            // Map Pie Chart
            $scope.pieLabels = res.pieChart.labels;
            $scope.pieData = res.pieChart.data;

            // Map Donut Chart
            $scope.donutLabels = ["Collected", "Balance"];
            var totalSales = res.cards.find(x => x.StatusDesc === "Total Sales Value").StatusCount;
            var totalBalance = res.cards.find(x => x.StatusDesc === "Outstanding Balance").StatusCount;
            $scope.donutData = [totalSales - totalBalance, totalBalance];

        }, function (error) {
            console.error("Dashboard Error:", error);
        });
    };

    $scope.getUserFinancialData = function (userId) {
        var getData = POSSystemService.GetUserFinancialService(userId);
        getData.then(function (returnedData) {
            $scope.finData = returnedData.data;

            // UI Styling for Charts
            $scope.donutColors = ['#2e7d32', '#d32f2f'];
            $scope.lineSeries = ['Payment Progress'];
            $scope.chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                scales: { yAxes: [{ ticks: { beginAtZero: true } }] }
            };
        });
    };
});