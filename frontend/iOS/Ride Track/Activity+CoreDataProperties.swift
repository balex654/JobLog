//
//  Activity+CoreDataProperties.swift
//  Ride Track
//
//  Created by Ben Alexander on 10/28/22.
//
//

import Foundation
import CoreData


extension Activity {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<Activity> {
        return NSFetchRequest<Activity>(entityName: "Activity")
    }

    @NSManaged public var endDate: Date?
    @NSManaged public var movingTime: Double
    @NSManaged public var name: String?
    @NSManaged public var startDate: Date?
    @NSManaged public var userId: String?
    @NSManaged public var bikeId: Int32
    @NSManaged public var activityRelation: NSOrderedSet?

}

// MARK: Generated accessors for activityRelation
extension Activity {

    @objc(insertObject:inActivityRelationAtIndex:)
    @NSManaged public func insertIntoActivityRelation(_ value: GpsPoint, at idx: Int)

    @objc(removeObjectFromActivityRelationAtIndex:)
    @NSManaged public func removeFromActivityRelation(at idx: Int)

    @objc(insertActivityRelation:atIndexes:)
    @NSManaged public func insertIntoActivityRelation(_ values: [GpsPoint], at indexes: NSIndexSet)

    @objc(removeActivityRelationAtIndexes:)
    @NSManaged public func removeFromActivityRelation(at indexes: NSIndexSet)

    @objc(replaceObjectInActivityRelationAtIndex:withObject:)
    @NSManaged public func replaceActivityRelation(at idx: Int, with value: GpsPoint)

    @objc(replaceActivityRelationAtIndexes:withActivityRelation:)
    @NSManaged public func replaceActivityRelation(at indexes: NSIndexSet, with values: [GpsPoint])

    @objc(addActivityRelationObject:)
    @NSManaged public func addToActivityRelation(_ value: GpsPoint)

    @objc(removeActivityRelationObject:)
    @NSManaged public func removeFromActivityRelation(_ value: GpsPoint)

    @objc(addActivityRelation:)
    @NSManaged public func addToActivityRelation(_ values: NSOrderedSet)

    @objc(removeActivityRelation:)
    @NSManaged public func removeFromActivityRelation(_ values: NSOrderedSet)

}

extension Activity : Identifiable {

}
