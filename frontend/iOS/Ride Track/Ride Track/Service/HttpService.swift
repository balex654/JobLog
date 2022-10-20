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
                    firstName: jsonData["firstName"]!.stringValue,
                    lastName: jsonData["lastName"]!.stringValue,
                    email: jsonData["email"]!.stringValue)
            }
        }
        catch {
            print("getUserById error")
            return User()
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
