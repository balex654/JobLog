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
    var weight: Double = 0
    
    init(id: String, firstName: String, lastName: String, email: String, weight: Double) {
        self.id = id
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.weight = weight
    }
    
    init() {}
}
