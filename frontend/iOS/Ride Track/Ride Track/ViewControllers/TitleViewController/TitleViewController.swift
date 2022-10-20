//
//  TitleViewController.swift
//  Ride Track
//
//  Created by Ben Alexander on 10/18/22.
//

import UIKit
import Auth0
import JWTDecode

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
        Auth0.webAuth().audience("https://ride-track-backend-gol2gz2rwq-uc.a.run.app").start {
            result in switch result {
                case .success(let credentials):
                    self.keychain.set(credentials.accessToken, forKey: "accessToken")
                    let request = self.prepareHTTPRequest(urlPath: "/user", httpMethod: "GET")
                    let task = URLSession.shared.dataTask(with: request) {(data, response, error) in
                        DispatchQueue.main.async {
                            let result = JSON(data!).dictionaryValue
                            if result["error"] != nil {
                                let configAccountVC = self.storyboard!.instantiateViewController(withIdentifier: "configureAccountViewController")
                                self.present(configAccountVC, animated: true)
                            }
                            else {
                                let dashboardVC = self.storyboard!.instantiateViewController(withIdentifier: "dashboardViewController")
                                self.present(dashboardVC, animated: true)
                            }
                        }
                        
                    }
                    task.resume()
                case .failure(let error):
                    print("Failed with: \(error)")
            }
        }
    }
    
}

extension UIViewController {
    func prepareHTTPRequest(urlPath: String, httpMethod: String) -> URLRequest {
        let urlStr = Variables.baseUrl + urlPath
        let url = URL(string: urlStr.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!)!
        var request = URLRequest(url: url)
        request.httpMethod = httpMethod
        let keychain = KeychainSwift()
        request.setValue("Bearer " + keychain.get("accessToken")!, forHTTPHeaderField: "Authorization")
        return request
    }
}
