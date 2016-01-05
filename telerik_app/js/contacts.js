var accessToken = "";

$(document).ready(function () {
    InitializeDate();
});

function InitializeDate() {
    accessToken = "";
}

ko.extenders.required = function (target, options) {
    //add some sub-observables to our observable
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();
    target.validationClass = ko.observable();

    var regEx = new RegExp(options.regEx);
    //define a function to do validation
    function validate(newValue) {
        target.hasError(regEx.test(newValue) && newValue !== "" ? false : true);
        target.validationClass(regEx.test(newValue) && newValue !== "" ? "form-control" : "form-control has-error");
        target.validationMessage(regEx.test(newValue) && newValue !== "" ? "" : options.overrideMessage || "This field is required");
    }

    //validate whenever the value changes
    target.subscribe(validate);

    //return the original observable
    return target;
};

function viewModel() {

    var self = this;

    self.contactList = ko.observableArray([]);

    self.isEditMode = ko.observable(false);

    self.isLoggedIn = ko.observable(false);

    self.pageIndex = ko.observable(0);

    self.totalResults = ko.observable(0);

    self.url = ko.observable("http://dnndev.me");

    self.username = ko.observable("host");

    self.password = ko.observable("dnnhost");

    self.logout = function () {
        if (accessToken.length === 0) {
            alert("You must login first");
            return;
        }
        $.ajax({
            type: 'GET',
            url: self.url() + "/DesktopModules/JwtAuth/API/mobile/logout",
            crossDomain: true,
            dataType: 'json',
            xhrFields: {
                withCredentials: false // don't pass cookies to the server
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
            },
            success: function (data) {
                InitializeDate();
                self.isLoggedIn(false);
            },
            error: function (jqXHR) {
                self.isLoggedIn(false);
                InitializeDate();
            }
        });
    }

    self.login = function () {
        if (self.username().length === 0 || self.username().length === 0) {
            alert("Must fill both username and password");
            return;
        }
        var postData = JSON.stringify({
            u: self.username(),
            p: self.password()
        });
        //var postData = "u=" + uname + "&p=" + pword; // goes with contentType: "application/x-www-form-urlencoded; charset=utf-8",
        $.ajax({
            type: 'POST',
            url: self.url() + "/DesktopModules/JwtAuth/API/mobile/login",
            crossDomain: true,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: postData,
            xhrFields: {
                withCredentials: false // don't pass cookies to the server
            },
            success: function (data) {
                accessToken = data.accessToken;

                self.isLoggedIn(true);

                self.init();
            },
            error: function (jqXHR) {
                alert("Wrong log-in info!");
                Logout();
            }
        });
    }

    self.selectedContact = {
        firstName: ko.observable('').extend({
            required: {
                overrideMessage: "Please enter a first name"
            }
        }),
        lastName: ko.observable('').extend({
            required: {
                overrideMessage: "Please enter a last name"
            }
        }),
        email: ko.observable('').extend({
            required: {
                overrideMessage: "Please enter a valid email address",
                regEx: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            }
        }),
        phone: ko.observable('').extend({
            required: {
                overrideMessage: "Please enter a valid phone number in the format: 123-456-7890",
                regEx: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
            }
        }),
        twitter: ko.observable("").extend({
            required: {
                overrideMessage: "Please enter a twitter handle"
            }
        }),
        contactId: ko.observable(-1),
        cancel: function () {
            self.isEditMode(false);
            this.firstName("");
            this.lastName("");
            this.email("");
            this.phone("");
            this.twitter("");
            this.contactId(-1);
        },
        saveContact: function () {
            self.selectedContact.firstName.valueHasMutated();
            self.selectedContact.lastName.valueHasMutated();
            self.selectedContact.phone.valueHasMutated();
            self.selectedContact.email.valueHasMutated();
            self.selectedContact.twitter.valueHasMutated();
            if ((self.selectedContact.firstName.hasError() || self.selectedContact.lastName.hasError() || self.selectedContact.email.hasError() || self.selectedContact.phone.hasError())) {
                return;
            }
            var params = {
                contactId: this.contactId(),
                firstName: this.firstName(),
                lastName: this.lastName(),
                email: this.email(),
                phone: this.phone(),
                twitter: this.twitter()
            };
            $.ajax({
                type: 'POST',
                url: self.url() + "/DesktopModules/Dnn/ContactList/API/Contact/SaveContact",
                data: params,
                crossDomain: true,
                dataType: 'json',
                xhrFields: {
                    withCredentials: false // don't pass cookies to the server
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
                    xhr.setRequestHeader("X-DNN-Moniker", "spamodulesample");
                },
                success: function (data) {
                    self.getContacts();
                },
                error: function () {
                    alert("Error, couldn't save data.");
                }
            });
            this.cancel();
        }
    }

    var deleteContact = function (contactId) {
        $.ajax({
            type: 'POST',
            url: self.url() + "/DesktopModules/Dnn/ContactList/API/Contact/DeleteContact",
            data: {
                contactId: contactId
            },
            crossDomain: true,
            dataType: 'json',
            xhrFields: {
                withCredentials: false // don't pass cookies to the server
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
                xhr.setRequestHeader("X-DNN-Moniker", "spamodulesample");
            },
            success: function (data) {
                self.getContacts();
            },
            error: function () {
                alert("Error, couldn't delete data.");
            }
        });
    }



    self.addContact = function () {
        self.isEditMode(true);
    }


    self.getContacts = function () {
        if (accessToken.length === 0) {
            alert("You must login first");
            return;
        }

        self.contactList([]);

        var params = {
            pageSize: self.pageSize,
            pageIndex: self.pageIndex(),
            searchTerm: ""
        };

        $.ajax({
            type: 'GET',
            url: self.url() + "/DesktopModules/Dnn/ContactList/API/Contact/GetContacts",
            data: params,
            crossDomain: true,
            dataType: 'json',
            xhrFields: {
                withCredentials: false // don't pass cookies to the server
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
                xhr.setRequestHeader("X-DNN-Moniker", "spamodulesample");
            },
            success: function (data) {
                for (var i = 0; i < data.data.results.length; i++) {
                    var result = data.data.results[i];
                    var contact = {
                        firstName: result.firstName,
                        lastName: result.lastName,
                        email: result.email,
                        phone: result.phone,
                        twitter: result.twitter,
                        contactId: result.contactId,
                        editContact: function () {
                            self.isEditMode(true);
                            self.selectedContact.firstName(this.firstName);
                            self.selectedContact.lastName(this.lastName);
                            self.selectedContact.email(this.email);
                            self.selectedContact.phone(this.phone);
                            self.selectedContact.twitter(this.twitter);
                            self.selectedContact.contactId(this.contactId);
                        },
                        deleteContact: function () {
                            deleteContact(this.contactId)
                        }
                    }
                    self.contactList.push(contact);
                }
                self.totalResults(data.data.totalCount);
            },
            error: function () {
                alert("Error getting data.");
            }
        });
    }

    self.refresh = function () {
        self.getContacts()
    };

    self.init = function () {
        self.getContacts();
    }

    self.pageSize = 2;
    self.pageIndex = ko.observable(0);

    self.startIndex = ko.computed(function () {
        return self.pageIndex() * self.pageSize + 1;
    });

    self.endIndex = ko.computed(function () {
        return Math.min((self.pageIndex() + 1) * self.pageSize, self.totalResults());
    });

    self.currentPage = ko.computed(function () {
        return self.pageIndex() + 1;
    });

    self.totalPages = ko.computed(function () {
        if (typeof self.totalResults === 'function' && self.totalResults())
            return Math.ceil(self.totalResults() / self.pageSize);
        return 1;
    });

    self.pagerVisible = ko.computed(function () {
        return self.totalPages() > 1;
    });

    self.pagerItemsDescription = ko.computed(function () {
        return "Showing " + self.startIndex() + " - " + self.endIndex() + " of " + self.totalResults() + " contacts";
    });

    self.pagerDescription = ko.computed(function () {
        return "Page: " + self.currentPage() + " of " + self.totalPages();
    });

    self.pagerPrevClass = ko.computed(function () {
        return 'prev' + (self.pageIndex() < 1 ? ' disabled' : '');
    });

    self.pagerNextClass = ko.computed(function () {
        return 'next' + (self.pageIndex() >= self.totalPages() - 1 ? ' disabled' : '');
    });

    self.prev = function () {
        if (self.pageIndex() <= 0) return;
        self.pageIndex(self.pageIndex() - 1);
        self.getContacts();
    };

    self.next = function () {
        if (self.pageIndex() >= self.totalPages() - 1) return;
        self.pageIndex(self.pageIndex() + 1);
        self.getContacts();
    };
};



ko.applyBindings(new viewModel());