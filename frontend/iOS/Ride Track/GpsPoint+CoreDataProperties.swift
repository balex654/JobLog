//
//  GpsPoint+CoreDataProperties.swift
//  Ride Track
//
//  Created by Ben Alexander on 12/31/22.
//
//

import Foundation
import CoreData


extension GpsPoint {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<GpsPoint> {
        return NSFetchRequest<GpsPoint>(entityName: "GpsPoint")
    }

    @NSManaged public var altitude: Double
    @NSManaged public var date: String?
    @NSManaged public var latitude: Double
    @NSManaged public var longitude: Double
    @NSManaged public var speed: Double
    @NSManaged public var gpsPointRelation: Activity?

}

extension GpsPoint : Identifiable {

}
