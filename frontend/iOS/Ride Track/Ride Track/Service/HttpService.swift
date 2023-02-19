//
//  HttpService.swift
//  Ride Track
//
//  Created by Ben Alexander on 10/20/22.
//

import Foundation
import SwiftyJSON
import Auth0

class HttpService {
    static func getUserById() async -> User {
        do {
            let request = await prepareHTTPRequest(urlPath: "/user", httpMethod: "GET")
            let (data, urlResponse) = try await URLSession.shared.data(for: request)
            let jsonData = JSON(data).dictionaryValue
            let httpResponse = urlResponse as! HTTPURLResponse
            if httpResponse.statusCode == 404 {
                return User()
            }
            else {
                return User(
                    id: jsonData["id"]!.stringValue,
                    firstName: jsonData["first_name"]!.stringValue,
                    lastName: jsonData["last_name"]!.stringValue,
                    email: jsonData["email"]!.stringValue,
                    weight: jsonData["weight"]!.doubleValue)
            }
        }
        catch {
            print("getUserById error")
            return User()
        }
    }
    
    static func createUser(user: User) async -> User {
        do {
            var request = await prepareHTTPRequest(urlPath: "/user", httpMethod: "POST")
            let userDict: [String: Any] = [
                "id": user.id,
                "first_name": user.firstName,
                "last_name": user.lastName,
                "email": user.email,
                "weight": user.weight
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
    
    static func createActivity(activity: Activity) async throws {
        do {
            var request = await prepareHTTPRequest(urlPath: "/activity", httpMethod: "POST")
            var gpsPointArray: [[String: Any]] = []
            for gps in activity.activityRelation!.array {
                let gpsPoint = gps as! GpsPoint
                let gpsPointDict: [String: Any] = [
                    "date": gpsPoint.date!,
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
                "gps_points": gpsPointArray,
                "bike_id": activity.bikeId,
                "total_mass": activity.totalMass
            ]
            let activityData = try JSONSerialization.data(withJSONObject: activityDict)
            request.httpBody = activityData
            let (_, urlResponse) = try await URLSession.shared.data(for: request)
            let httpResponse = urlResponse as! HTTPURLResponse
            if httpResponse.statusCode != 201 {
                throw UploadActivityError.uploadError
            }
        }
        catch {
            throw UploadActivityError.uploadError
        }
    }
    
    static func getBikes() async -> [Bike] {
        do {
            let request = await prepareHTTPRequest(urlPath: "/bike", httpMethod: "GET")
            let (data, _) = try await URLSession.shared.data(for: request)
            let jsonData = JSON(data).dictionaryValue
            var bikes: [Bike] = []
            for bikeJsonData in jsonData["bikes"]!.arrayValue {
                bikes.append(Bike(
                    id: bikeJsonData["id"].intValue,
                    weight: bikeJsonData["weight"].doubleValue,
                    name: bikeJsonData["name"].stringValue,
                    user_id: bikeJsonData["user_id"].stringValue))
            }
            return bikes
        }
        catch {
            print("getBikes error")
            return []
        }
    }
    
    static func createBike(bike: Bike) async {
        do {
            var request = await prepareHTTPRequest(urlPath: "/bike", httpMethod: "POST")
            let bikeDict: [String: Any] = [
                "name": bike.name,
                "weight": bike.weight,
            ]
            let bikeData = try JSONSerialization.data(withJSONObject: bikeDict)
            request.httpBody = bikeData
            let (_, _) = try await URLSession.shared.data(for: request)
        }
        catch {
            print("createBike error")
        }
    }
    
    static func editBike(bike: Bike) async {
        do {
            var request = await prepareHTTPRequest(urlPath: "/bike/\(bike.id)", httpMethod: "PUT")
            let bikeDict: [String: Any] = [
                "name": bike.name,
                "weight": bike.weight,
            ]
            let bikeData = try JSONSerialization.data(withJSONObject: bikeDict)
            request.httpBody = bikeData
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            let (_, _) = try await URLSession.shared.data(for: request)
        }
        catch {
            print("edit bike error")
        }
    }
    
    private static func prepareHTTPRequest(urlPath: String, httpMethod: String) async ->  URLRequest {
        let urlStr = Variables.baseUrl + urlPath
        let url = URL(string: urlStr.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!)!
        var request = URLRequest(url: url)
        request.httpMethod = httpMethod
        do {
            let credentialsManager = CredentialsManager(authentication: Auth0.authentication())
            let credentials = try await credentialsManager.credentials(withScope: "offline_access")
            request.setValue("Bearer " + credentials.accessToken, forHTTPHeaderField: "Authorization")
            return request
        }
        catch {
            print("Failed getting credentials: \(error)")
            return request
        }
    }
}
