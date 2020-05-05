//import React from 'react';

export default class Moxsoar {
    constructor() {
    }

    Auth(username, password, obj) {

        var b = {
            "username": username,
            "password": password
        }

        var r = new MoxsoarResponse();
        fetch("/auth", {
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
}

export class MoxsoarResponse {
    constructor() {
        this.failed = false;
        this.error = '';
    }

    SetResponse(response) {
        this.response = response
    }

    SetJson(json) {
        if (this.response.status == 401) {
            var msg = json['Message'];
            this.SetError(msg);
        }
    }

    SetError(error) {
        this.failed = true;
        this.error = error;
    }
}