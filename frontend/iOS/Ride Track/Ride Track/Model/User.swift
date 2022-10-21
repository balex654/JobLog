//
//  User.swift
//  Ride Track
//
//  Created by Ben Alexander on 10/20/22.
//

import Foundation

class User {
    var id: String = ""
    var firstName: String = ""
    var lastName: String = ""
    var email: String = ""
    
    init(id: String, firstName: String, lastName: String, email: String) {
        self.id = id
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
    }
    
    init() {}
}
