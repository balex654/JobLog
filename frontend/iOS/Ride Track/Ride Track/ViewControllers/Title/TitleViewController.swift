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

class TitleViewController: UIViewController {
    
    @IBOutlet weak var LoginOrCreate: UIButton!
    let credentialsManager = CredentialsManager(authentication: Auth0.authentication())
        
    override func viewDidLoad() {
        super.viewDidLoad()
        LoginOrCreate.layer.cornerRadius = 17
        NotificationCenter.default.addObserver(self, selector: #selector(createdAccount), name: Notification.Name("createdAccount"), object: nil)
        
        Task {
            if credentialsManager.canRenew() {
                await getUserAndGoToDashboard()
            }
        }
    }
    
    @IBAction func LoginOrCreateAction(_ sender: Any) {
        Task {
            do {
                let credentials = try await Auth0.webAuth()
                    .audience("https://ride-track-backend-gol2gz2rwq-uc.a.run.app")
                    .scope("offline_access")
                    .start()
                let _ = credentialsManager.store(credentials: credentials)
                await getUserAndGoToDashboard()
            }
            catch {
                print("Error logging in")
            }
        }
    }
    
    func getUserAndGoToDashboard() async {
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
    
    @objc func createdAccount() {
        let dashboardVC = self.storyboard!.instantiateViewController(withIdentifier: "dashboardViewController")
        self.present(dashboardVC, animated: true)
    }
}
