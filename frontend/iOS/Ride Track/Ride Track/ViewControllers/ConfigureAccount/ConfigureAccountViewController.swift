//
//  ConfigureAccountViewController.swift
//  Ride Track
//
//  Created by Ben Alexander on 10/18/22.
//

import UIKit
import JWTDecode
import Auth0

class ConfigureAccountViewController: UIViewController {
    
    @IBOutlet weak var FirstNameInput: UITextField!
    @IBOutlet weak var LastNameInput: UITextField!
    @IBOutlet weak var WeightInput: UITextField!
    @IBOutlet weak var RegisterButton: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        FirstNameInput.layer.cornerRadius = 17
        FirstNameInput.layer.borderWidth = 1
        FirstNameInput.borderStyle = .none
        LastNameInput.layer.cornerRadius = 17
        LastNameInput.layer.borderWidth = 1
        LastNameInput.borderStyle = .none
        WeightInput.layer.cornerRadius = 17
        WeightInput.layer.borderWidth = 1
        WeightInput.borderStyle = .none
        RegisterButton.layer.cornerRadius = 17
    }

    @IBAction func RegisterAction(_ sender: Any) {
        Task {
            if isFormValid() {
                do {
                    let credentialsManager = CredentialsManager(authentication: Auth0.authentication())
                    let credentials = try await credentialsManager.credentials(withScope: "read write profile email openid offline_access")
                    guard let jwt = try? decode(jwt: credentials.accessToken),
                          let id = jwt["sub"].string,
                          let email = jwt["email"].string else { return }
                    let user = User(
                        id: id,
                        firstName: FirstNameInput.text!,
                        lastName: LastNameInput.text!,
                        email: email,
                        weight: Double(WeightInput.text!)!)
                    
                    let _ = await HttpService.createUser(user: user)
                    Variables.user = user
                    self.dismiss(animated: true)
                    NotificationCenter.default.post(name: Notification.Name("createdAccount"), object: nil)
                }
                catch {
                    print("Failed getting credentials: \(error)")
                }
            }
        }
    }
    
    func isFormValid() -> Bool {
        if FirstNameInput.text == "" || LastNameInput.text == "" || WeightInput.text == "" {
            Util.MakeAlert(message: "A field is empty", vc: self)
            return false
        }
        if FirstNameInput.text!.count > 200 || LastNameInput.text!.count > 200 {
            Util.MakeAlert(message: "Input can't be greater than 200 characters", vc: self)
            return false
        }
        
        return true
    }
}
