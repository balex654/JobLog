//
//  MakeAlert.swift
//  Ride Track
//
//  Created by Ben Alexander on 2/16/23.
//

import Foundation
import UIKit

class Util {
    static func MakeAlert(message: String, vc: UIViewController) {
        let alert = UIAlertController(title: message, message: nil, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Dismiss", style: .default))
        vc.present(alert, animated: true, completion: nil)
    }
}
