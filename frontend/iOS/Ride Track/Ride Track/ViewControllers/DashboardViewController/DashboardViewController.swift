//
//  DashboardViewController.swift
//  Ride Track
//
//  Created by Ben Alexander on 10/18/22.
//

import UIKit
import Auth0
import KeychainSwift

class DashboardViewController: UIViewController {

    @IBOutlet weak var StartStopButton: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        StartStopButton.layer.cornerRadius = 17
    }
    
    @IBAction func StartStopAction(_ sender: Any) {
        
    }
    
    @IBAction func LogoutAction(_ sender: Any) {
        Task {
            do {
                let keychain = KeychainSwift()
                keychain.delete("accessToken")
                Variables.user = User()
                self.dismiss(animated: true)
                try await Auth0.webAuth().clearSession()
            }
            catch {
                print("Error logging out")
            }
        }
    }
}
