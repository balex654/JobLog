//
//  Stopwatch.swift
//  Ride Track
//
//  Created by Ben Alexander on 10/24/22.
//

import Foundation

class Stopwatch {
    private var startTime: Date?
    private var accumulatedTime: TimeInterval = 0
    
    func start() {
        self.accumulatedTime = self.elapsedTime()
        self.startTime = Date()
    }
    
    func stop() {
        self.accumulatedTime = self.elapsedTime()
        self.startTime = nil
    }
    
    func reset() {
        self.accumulatedTime = 0
        self.startTime = nil
    }
    
    func elapsedTime() -> TimeInterval {
        return -(self.startTime?.timeIntervalSinceNow ?? 0) + self.accumulatedTime
    }
}
