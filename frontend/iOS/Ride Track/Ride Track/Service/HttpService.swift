//
//  HttpService.swift
//  Ride Track
//
//  Created by Ben Alexander on 10/20/22.
//

import Foundation
import SwiftyJSON
import KeychainSwift

class HttpService {
    static func getUserById() async -> User {
        do {
            let request = prepareHTTPRequest(urlPath: "/user", httpMethod: "GET")
            let (data, _) = try await URLSession.shared.data(for: request)
            let jsonData = JSON(data).dictionaryValue
            if jsonData["error"] != nil {
                return User()
            }
            else {
                return User(
                    id: jsonData["id"]!.stringValue,
                    firstName: jsonData["first_name"]!.stringValue,
                    lastName: jsonData["last_name"]!.stringValue,
                    email: jsonData["email"]!.stringValue)
            }
        }
        catch {
            print("getUserById error")
            return User()
        }
    }
    
    static func createUser(user: User) async -> User {
        do {
            var request = prepareHTTPRequest(urlPath: "/user", httpMethod: "POST")
            let userDict: [String: String] = [
                "id": user.id,
                "first_name": user.firstName,
                "last_name": user.lastName,
                "email": user.email
            ]
            let userData = try JSONSerialization.data(withJSONObject: userDict)
            request.httpBody = userData
            let (_, _) = try await URLSession.shared.data(for: request)
            return user
        }
        catch {
            print("createUser error")
            return User()
        }
    }
    
    static func createActivity(activity: Activity) async {
        do {
            var request = prepareHTTPRequest(urlPath: "/activity", httpMethod: "POST")
            var gpsPointArray: [[String: Any]] = []
            for gps in activity.activityRelation!.array {
                let gpsPoint = gps as! GpsPoint
                let gpsPointDict: [String: Any] = [
                    "date": Date().dateToString(date: gpsPoint.date!, format: "yyyy-MM-dd'T'HH:mm:ssZ"),
                    "latitude": gpsPoint.latitude,
                    "longitude": gpsPoint.longitude,
                    "altitude": gpsPoint.altitude,
                    "speed": gpsPoint.speed
                ]
                gpsPointArray.append(gpsPointDict)
            }
            let activityDict: [String: Any] = [
                "name": activity.name!,
                "start_date": Date().dateToString(date: activity.startDate!, format: "yyyy-MM-dd'T'HH:mm:ssZ"),
                "end_date": Date().dateToString(date: activity.endDate!, format: "yyyy-MM-dd'T'HH:mm:ssZ"),
                "moving_time": activity.movingTime,
                "gps_points": gpsPointArray
            ]
            let activityData = try JSONSerialization.data(withJSONObject: activityDict)
            request.httpBody = activityData
            let (_, _) = try await URLSession.shared.data(for: request)
        }
        catch {
            print("createActivity error")
        }
    }
    
    private static func prepareHTTPRequest(urlPath: String, httpMethod: String) -> URLRequest {
        let urlStr = Variables.baseUrl + urlPath
        let url = URL(string: urlStr.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!)!
        var request = URLRequest(url: url)
        request.httpMethod = httpMethod
        let keychain = KeychainSwift()
        request.setValue("Bearer " + keychain.get("accessToken")!, forHTTPHeaderField: "Authorization")
        return request
    }
}
