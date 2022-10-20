//
//  ConfigureAccountViewController.swift
//  Ride Track
//
//  Created by Ben Alexander on 10/18/22.
//

import UIKit

class ConfigureAccountViewController: UIViewController {
    
    @IBOutlet weak var FirstNameInput: UITextField!
    @IBOutlet weak var LastNameInput: UITextField!
    @IBOutlet weak var RegisterButton: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        FirstNameInput.layer.cornerRadius = 17
        FirstNameInput.layer.borderWidth = 1
        FirstNameInput.borderStyle = .none
        LastNameInput.layer.cornerRadius = 17
        LastNameInput.layer.borderWidth = 1
        LastNameInput.borderStyle = .none
        RegisterButton.layer.cornerRadius = 17
    }

}
