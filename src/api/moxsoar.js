//import React from 'react';

export default class Moxsoar {
    Auth(username, password, obj) {

        var b = {
            "username": username,
            "password": password
        }

        var r = new MoxsoarResponse();
        fetch("/api/auth", {
            method: 'post',
            body: JSON.stringify(b),
        })
            .then(function (response) {
                r.SetResponse(response);

                return response.json()
            })
            .then(
                (result) => {
                    r.SetJson(result);
                    obj.authcb(r);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    r.SetError(error);
                    obj.authcb(r);
                }
            )
    }

    GetPacks(obj) {

        var r = new MoxsoarResponse();
        fetch("/api/packs", {
            method: 'get'
        })
            .then(function (response) {
                r.SetResponse(response);

                return response.json()
            })
            .then(
                (result) => {
                    r.SetJson(result);
                    obj.addPacks(r);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    r.SetError(error);
                    obj.addPacks(r);
                }
            )
    }

    GetPackDetails(obj, packName) {

        var r = new MoxsoarResponse();
        fetch("/api/packs/" + packName, {
            method: 'get'
        })
            .then(function (response) {
                r.SetResponse(response);

                return response.json()
            })
            .then(
                (result) => {
                    r.SetJson(result);
                    obj.setDetails(r);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    r.SetError(error);
                    obj.setDetails(r);
                }
            )
    }
    GetIntegrationDetails(obj, packName, integrationName) {

        var r = new MoxsoarResponse();
        fetch("/api/packs/" + packName + "/" + integrationName, {
            method: 'get'
        })
            .then(function (response) {
                r.SetResponse(response);

                return response.json()
            })
            .then(
                (result) => {
                    r.SetJson(result);
                    obj.setDetails(r);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    r.SetError(error);
                    obj.setDetails(r);
                }
            )
    }

    GetRouteDetails(obj, packName, integrationName, routeIndex) {

        var r = new MoxsoarResponse();
        fetch("/api/packs/" + packName + "/" + integrationName + "/route/" + routeIndex, {
            method: 'get'
        })
            .then(function (response) {
                r.SetResponse(response);

                return response.json()
            })
            .then(
                (result) => {
                    r.SetJson(result);
                    obj.setDetails(r);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    r.SetError(error);
                    obj.setDetails(r);
                }
            )
    }

    ClonePack(obj, packName, repo) {

        var b = {
            "packname": packName,
            "repo": repo
        }
        var r = new MoxsoarResponse();
        fetch("/api/packs/clone", {
            method: 'POST',
            body: JSON.stringify(b)
        })
            .then(function (response) {
                r.SetResponse(response);
                if (!response.ok) {
                    throw "Failed to clone the repository."
                } else {
                    return response.json()
                }
            })
            .then(
                (result) => {
                    r.SetJson(result);
                    obj.setResult(r);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    r.SetError(error);
                    obj.setResult(r);
                }
            )
    }

    SavePack(cb, packname, message, author) {

        var b = {
            "PackName": packname,
            "CommitMessage": message,
            "Author": author
        }
        var r = new MoxsoarResponse();
        fetch("/api/packs/save", {
            method: 'POST',
            body: JSON.stringify(b)
        })
            .then(function (response) {
                r.SetResponse(response);
                if (!response.ok) {
                    throw "Failed to save (commit) the changes."
                } else {
                    return response.json()
                }
            })
            .then(
                (result) => {
                    r.SetJson(result);
                    cb(r);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    r.SetError(error);
                    cb(r);
                }
            )
    }


    ActivatePack(obj, packName) {

        var b = {
            "packname": packName,
        }
        var r = new MoxsoarResponse();
        fetch("/api/packs/activate", {
            method: 'POST',
            body: JSON.stringify(b)
        })
            .then(function (response) {
                r.SetResponse(response);
                if (!response.ok) {
                    throw "Failed to activate pack."
                } else {
                    return response.json()
                }
            })
            .then(
                (result) => {
                    r.SetJson(result);
                    obj.activatecb(r);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    r.SetError(error);
                    obj.activatecb(r);
                }
            )
    }

    AddUser(cb, username, password) {

        var b = {
            "username": username,
            "password": password,
        }
        var r = new MoxsoarResponse();
        fetch("/api/adduser", {
            method: 'POST',
            body: JSON.stringify(b)
        })
            .then(function (response) {
                r.SetResponse(response);
                if (!response.ok) {
                    throw "Failed to add user."
                } else {
                    return response.json()
                }
            })
            .then(
                (result) => {
                    r.SetJson(result);
                    cb(r);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    r.SetError(error);
                    cb(r);
                }
            )
    }


    UpdatePack(cb, packName) {

        var b = {
            "packname": packName
        }
        var r = new MoxsoarResponse();
        fetch("/api/packs/update", {
            method: 'POST',
            body: JSON.stringify(b)
        })
            .then(function (response) {
                r.SetResponse(response);
                if (!response.ok) {
                    throw "Failed to update the pack."
                } else {
                    return response.json()
                }
            })
            .then(
                (result) => {
                    r.SetJson(result);
                    cb(r);
                },

                (error) => {
                    r.SetError(error);
                    cb(r);
                }
            )
    }

    AddRoute(cb, packName, integrationName, route) {

        var method = {
            "HttpMethod": route.method,
            "ResponseFile": route.filename,
            "ResponseCode": route.responsecode,
            "ResponseString": route.responsestring,
        }

        if (route.matchregex) {
            method["MatchRegex"] = route.matchregex
        }
        console.log(method)
        var b = {
            "Route": {
                "Path": route.path,
                "Methods": [
                        method
                ]
            }
        }

        var r = new MoxsoarResponse();
        fetch("/api/packs/" + packName + "/" + integrationName + "/route", {
            method: 'POST',
            body: JSON.stringify(b)
        })
            .then(function (response) {
                r.SetResponse(response);
                if (!response.ok) {
                    throw "Failed to add route."
                } else {
                    return response.json()
                }
            })
            .then(
                (result) => {
                    r.SetJson(result);
                    cb(r);
                },

                (error) => {
                    r.SetError(error);
                    cb(r);
                }
            )
    }

    DeleteRoute(cb, packName, integrationName, pathName) {
        var b = {
            "Path": pathName
        }
        var r = new MoxsoarResponse();
        fetch("/api/packs/" + packName + "/" + integrationName + "/route", {
            method: 'DELETE',
            body: JSON.stringify(b)
        })
            .then(function (response) {
                r.SetResponse(response);
                if (!response.ok) {
                    throw "Failed to delete route."
                } else {
                    return response.json()
                }
            })
            .then(
                (result) => {
                    r.SetJson(result);
                    cb(r);
                },

                (error) => {
                    r.SetError(error);
                    cb(r);
                }
            )
    }

    AddIntegration(cb, packName, name) {
        var r = new MoxsoarResponse();
        fetch("/api/packs/" + packName + "/" + name, {
            method: 'POST'
        })
            .then(function (response) {
                r.SetResponse(response);
                if (!response.ok) {
                    throw "Failed to add integration."
                } else {
                    return response.json()
                }
            })
            .then(
                (result) => {
                    r.SetJson(result);
                    cb(r);
                },

                (error) => {
                    r.SetError(error);
                    cb(r);
                }
            )
    }

    GetSettings(cb) {
        var r = new MoxsoarResponse();
        fetch("/api/settings", {
            method: 'GET'
        })
            .then(function (response) {
                r.SetResponse(response);
                if (!response.ok) {
                    throw "Failed to retrieve system settings."
                } else {
                    return response.json()
                }
            })
            .then(
                (result) => {
                    r.SetJson(result);
                    cb(r);
                },

                (error) => {
                    r.SetError(error);
                    cb(r);
                }
            )
    }

    TestSettings(cb) {
        var r = new MoxsoarResponse();
        fetch("/api/settings/test", {
            method: 'GET'
        })
            .then(function (response) {
                r.SetResponse(response);
                if (!response.ok) {
                    throw "Failed to retrieve system settings."
                } else {
                    return response.json()
                }
            })
            .then(
                (result) => {
                    r.SetJson(result);
                    cb(r);
                },

                (error) => {
                    r.SetError(error);
                    cb(r);
                }
            )
    }

    EditSettings(cb, settings) {
        var r = new MoxsoarResponse();
        var b = {
            "DisplayHost": settings.get("displayhost"),
            "Address": settings.get("address"),
            "Username": settings.get("username"),
            "Password": settings.get("password"),

        }
        fetch("/api/settings", {
            method: 'POST',
            body: JSON.stringify(b)
        })
            .then(function (response) {
                r.SetResponse(response);
                if (!response.ok) {
                    throw "Failed to update settings."
                } else {
                    return response.json()
                }
            })
            .then(
                (result) => {
                    r.SetJson(result);
                    cb(r);
                },

                (error) => {
                    r.SetError(error);
                    cb(r);
                }
            )
    }

    DeleteIntegration(cb, packName, integrationName) {
        var r = new MoxsoarResponse();
        fetch("/api/packs/" + packName + "/" + integrationName, {
            method: 'DELETE'
        })
            .then(function (response) {
                r.SetResponse(response);
                if (!response.ok) {
                    throw "Failed to delete integration."
                } else {
                    return response.json()
                }
            })
            .then(
                (result) => {
                    r.SetJson(result);
                    cb(r);
                },

                (error) => {
                    r.SetError(error);
                    cb(r);
                }
            )
    }

}

export class MoxsoarResponse {
    constructor() {
        this.failed = false;
        this.error = '';
        this.json = {};
    }

    SetResponse(response) {
        this.response = response
    }

    SetJson(json) {
        if (this.response.status == 401) {
            var msg = json['Message'];
            this.SetError(msg);
        } else {
            this.json = json;
        }
    }

    SetError(error) {
        this.failed = true;
        if (typeof error != "string") {
            this.error = "Failed to connect to the MOXSOAR API server."
        } else {
            this.error = error;
        }
    }
}
