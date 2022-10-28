//
//  Bike.swift
//  Ride Track
//
//  Created by Ben Alexander on 10/28/22.
//

import Foundation

class Bike {
    var id: Int = 0
    var weight: Double = 0
    var name: String = ""
    var user_id: String = ""
    
    init(id: Int, weight: Double, name: String, user_id: String) {
        self.id = id
        self.weight = weight
        self.name = name
        self.user_id = user_id
    }
    
    init() {}
}
