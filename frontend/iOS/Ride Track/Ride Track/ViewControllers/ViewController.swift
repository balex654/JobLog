//
//  ViewController.swift
//  Ride Track
//
//  Created by Ben Alexander on 10/12/22.
//

import UIKit
import Auth0
import JWTDecode

class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    @IBAction func testLogin(_ sender: Any) {
        Auth0.webAuth().start {
            result in switch result {
                case .success(let credentials):
                    let jwt = try? decode(jwt: credentials.idToken)
                    print("Email: \(jwt!["email"].string)")
                    print("Obtained credentials: \(credentials)")
                case .failure(let error):
                    print("Failed with: \(error)")
            }
        }
    }
    
    @IBAction func testLogout(_ sender: Any) {
        Auth0.webAuth().clearSession {
            result in switch result {
                case .success:
                    print("Logged out")
                case .failure(let error):
                    print("Failed with: \(error)")
            }
        }
    }
}

