//
//  TitleViewController.swift
//  Ride Track
//
//  Created by Ben Alexander on 10/18/22.
//

import UIKit
import Auth0
import JWTDecode
import SwiftyJSON
import KeychainSwift

class TitleViewController: UIViewController {
    
    @IBOutlet weak var LoginOrCreate: UIButton!
    
    let keychain = KeychainSwift()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        LoginOrCreate.layer.cornerRadius = 17
    }
    
    /*
     Call Auth0
     if user exists go directly to dashboard
     if not go to configure account
     */
    
    @IBAction func LoginOrCreateAction(_ sender: Any) {
        Task {
            do {
                let credentials = try await Auth0.webAuth().audience("https://ride-track-backend-gol2gz2rwq-uc.a.run.app").start()
                let keychain = KeychainSwift()
                self.keychain.set(credentials.accessToken, forKey: "accessToken")
                let user = await HttpService.getUserById()
                if user.id == "" {
                    let configAccountVC = self.storyboard!.instantiateViewController(withIdentifier: "configureAccountViewController")
                    self.present(configAccountVC, animated: true)
                }
                else {
                    Variables.user = user
                    let dashboardVC = self.storyboard!.instantiateViewController(withIdentifier: "dashboardViewController")
                    self.present(dashboardVC, animated: true)
                }
            }
            catch {
                print("Error logging in")
            }
        }
    }
    
}
